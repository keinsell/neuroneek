import json
from typing import Any, Optional

import requests
from metaflow import FlowSpec, step
from prisma.types import (
    DosageCreateInput,
    RouteOfAdministrationCreateInput,
    DosageWhereInput,
    EffectCreateInput,
)

import prisma
import pw_types
import types_effectindex


class GetPsychonautwiki(FlowSpec):
    """
    A flow where Metaflow prints 'Hi'.

    Run this flow to validate that Metaflow is installed correctly.

    """

    def __init__(self, use_cli=True):
        super().__init__(use_cli)
        self.effectindex: Optional[types_effectindex.EffectIndexRoot] = None
        self.raw_json_data: Any = None
        self.psychonautwiki: pw_types.Model

    @step
    def start(self):
        """
        This is the 'start' step. All flows must have a step named 'start' that
        is the first step in the flow.

        """

        # Clean database from previous data
        db = prisma.Prisma()
        db.connect()
        db.dosage.delete_many()
        db.routeofadministration.delete_many()
        db.substance.delete_many()
        db.effect.delete_many()

        self.next(self.get_psychonautwiki)

    @step
    def get_psychonautwiki(self):
        """
        A step to get data from PsychonautWiki API.

        """
        from metaflow import Flow, get_metadata

        print("Using metadata provider: %s" % get_metadata())

        cached_data = Flow("GetPsychonautwiki").latest_successful_run
        print("Using analysis from '%s'" % str(cached_data))

        if not cached_data:
            data = {
                "query": """
                         query AllSubstances {
                             substances(limit: 9999) {
                                 name
                                 commonNames
                                 url
                                 class {
                                     chemical
                                     psychoactive
                                 }
                                 tolerance {
                                     full
                                     half
                                     zero
                                 }
                                 roas {
                                     name
                                     dose {
                                         units
                                         threshold
                                         light {
                                             min
                                             max
                                         }
                                         common {
                                             min
                                             max
                                         }
                                         strong {
                                             min
                                             max
                                         }
                                         heavy
                                     }
                                     duration {
                                         onset {
                                             min
                                             max
                                             units
                                         }
                                         comeup {
                                             min
                                             max
                                             units
                                         }
                                         peak {
                                             min
                                             max
                                             units
                                         }
                                         offset {
                                             min
                                             max
                                             units
                                         }
                                         total {
                                             min
                                             max
                                             units
                                         }
                                         afterglow {
                                             min
                                             max
                                             units
                                         }
                                     }
                                     bioavailability {
                                         min
                                         max
                                     }
                                 }
                                 addictionPotential
                                 toxicity
                                 crossTolerances
                                 uncertainInteractions {
                                     name
                                 }
                                 unsafeInteractions {
                                     name
                                 }
                                 dangerousInteractions {
                                     name
                                 }
    
                                 effects {
                                     name
                                     url
                                 }
                             }
                         }
                         """,
                "variables": None,
            }

            response = requests.post(
                "https://api.psychonautwiki.org/", json=data, headers=None
            )
            response.raise_for_status()

            response_data = response.json()

            if "errors" in response_data:
                raise Exception("GraphQL errors: {}".format(response_data["errors"]))

            print(response_data)

            self.raw_json_data = response_data
        else:
            print("Found cached run, restoring data...")
            self.raw_json_data = cached_data.data.raw_json_data
            print(self.raw_json_data)

        # Save a local copy of the data in .out/psychonautwiki.json
        with open("psychonautwiki.json", "w") as outfile:
            json.dump(self.raw_json_data, outfile, indent=2)

        self.next(self.save_information_from_psychonautwiki)

    @step
    def save_information_from_psychonautwiki(self):
        """
        Save information from PsychonautWiki into SQLite managed by Prisma.
        """

        db = prisma.Prisma()
        db.connect()

        print("Parsing saved information into typed model...")
        self.psychonautwiki: pw_types.Model = pw_types.Model.parse_obj(
            self.raw_json_data
        )

        print("Transforming and storing PsychonautWiki data...")
        substances = self.psychonautwiki.data.substances

        ignored_substances = [
            "Selective serotonin reuptake inhibitor",
            "Stimulants",
            "Serotonin-norepinephrine reuptake inhibitor",
            "Serotonin",
            "Serotonergic psychedelic",
            "Sedative",
            "Depressant",
            "Deliriant",
        ]

        for pw_substance in substances:
            substance = pw_types.Substance.parse_obj(pw_substance)

            # Continue loop if substance is ignored or starts with 'Substituted'
            if substance.name in ignored_substances or substance.name.startswith(
                "Substituted"
            ):
                continue

            # Continue loop if substance already exists in database
            if db.substance.find_first(where={"name": substance.name}):
                print("Substance already exists: ", substance.name)
                continue

            print("Processing substance: ", substance.name)

            chemical_class = (
                ",".join(substance.class_.chemical)
                if substance.class_ and substance.class_.chemical
                else ""
            )
            psychoactive_class = (
                ",".join(substance.class_.psychoactive)
                if substance.class_ and substance.class_.psychoactive
                else ""
            )
            common_names = (
                # Parse the common names list to string separated by comma
                ",".join(substance.commonNames) if substance.commonNames else ""
            )

            try:
                db_substance = db.substance.create(
                    data={
                        "name": substance.name,
                        "psychoactive_class": psychoactive_class,
                        "chemical_class": chemical_class,
                        "common_names": common_names,
                    }
                )

                print(f"Created {db_substance.name}", db_substance)
            except Exception:
                print(f"Failed to insert {substance.name}")
                continue

        self.next(self.process_route_of_administration)

    @step
    def process_route_of_administration(self):
        """
        For each substance in a database we will explore the route of administration in the provided
        dataset, if one exists in a database the insertion will be skipped nad if not it will be inserted.
        """

        db = prisma.Prisma()
        db.connect()

        substances = db.substance.find_many()

        # Log count of counted substances
        print("Substances in database: ", len(substances))

        for substance in substances:
            print("Processing substance: ", substance.name)

            # Find substance in psychonautwiki dataset available in class.
            pw_substance = next(
                (
                    pw_substance
                    for pw_substance in self.psychonautwiki.data.substances
                    if pw_substance.name == substance.name
                ),
                None,
            )

            if not pw_substance:
                print("Substance not found in PsychonautWiki dataset")
                continue

            # Find route of administration in the dataset
            roas = pw_substance.roas

            if not roas:
                print("No route of administration found for substance")
                continue

            for roa in roas:
                print("Processing route of administration: ", roa.name)

                # Find route of administration in the database
                db_roa = db.routeofadministration.find_first(
                    where={"name": roa.name, "substanceName": pw_substance.name}
                )

                if db_roa:
                    print("Route of administration already exists in the database")
                    continue

                print("Inserting route of administration into the database")

                roa_input: RouteOfAdministrationCreateInput = {
                    "name": roa.name,
                    "substanceName": substance.name,
                    "bioavailability": (
                        roa.bioavailability.min
                        if roa.bioavailability and roa.bioavailability.min
                        else (
                            roa.bioavailability.max
                            if roa.bioavailability and roa.bioavailability.max
                            else 100
                        )
                    ),
                }

                try:
                    db_roa = db.routeofadministration.create(roa_input)
                    print(f"Inserted {db_roa.name}", db_roa)
                except TypeError as e:
                    print(f"Failed to insert {roa['name']}: ", e)
                    continue

            # For each route of administration dosage must be defined, if not it will be skipped
            for roa in roas:
                print("Processing route of administration: ", roa.name)

                # Find route of administration in the database
                db_roa = db.routeofadministration.find_first(
                    where={"name": roa.name, "substanceName": pw_substance.name}
                )

                if not db_roa:
                    print("Route of administration not found in the database")
                    continue

                # Find dosage in the dataset
                dose = roa.dose

                if not dose:
                    print("No dosage found for route of administration")
                    continue

                print("Processing dosage for route of administration: ", roa.name)

                dosage_intensivities = [
                    "threshold",
                    "light",
                    "common",
                    "strong",
                    "heavy",
                ]

                for intensivity in dosage_intensivities:
                    print(
                        f"Processing {intensivity} dosage for {roa.name} of {substance.name}:",
                        dose.model_dump_json(),
                    )

                    if getattr(dose, intensivity, None) is None:
                        print(
                            f"No {intensivity} dosage found for {roa.name} of {substance.name}",
                            dose.model_dump_json(),
                        )
                        continue

                    try:
                        if intensivity == "threshold" or intensivity == "heavy":
                            dose_input: DosageCreateInput = {
                                "routeOfAdministrationId": db_roa.id,
                                "intensivity": intensivity,
                                "amount_min": dose.model_dump()[intensivity],
                                "amount_max": dose.model_dump()[intensivity],
                                "unit": dose.units,
                            }
                        else:
                            dose_input: DosageCreateInput = {
                                "routeOfAdministrationId": db_roa.id,
                                "intensivity": intensivity,
                                "amount_min": dose.model_dump()[intensivity]["min"],
                                "amount_max": dose.model_dump()[intensivity]["max"],
                                "unit": dose.units,
                            }
                    except Exception as e:
                        print(f"Failed to extract data for {intensivity}: ", e)
                        continue

                    if not dose_input["amount_min"] or not dose_input["amount_max"]:
                        print(f"Failed to extract data for {intensivity}")
                        continue

                    try:
                        dosage_find_first_query: DosageWhereInput = {
                            "routeOfAdministrationId": db_roa.id,
                            "intensivity": intensivity,
                        }

                        # Check if dosage already exists in the database
                        db_dose = db.dosage.find_first(where=dosage_find_first_query)

                        if db_dose:
                            print(
                                f"{intensivity} dosage for {roa.name} of {substance.name} already exists in the database"
                            )
                            continue

                        db_dose = db.dosage.create(data=dose_input)
                        print(f"Inserted {db_dose.id}", db_dose)
                    except TypeError as e:
                        print(
                            f"Failed to insert {dose['routeOfAdministrationName']}: ", e
                        )
                        continue

        self.next(self.import_effects)

    @step
    def import_effects(self):
        # Read effectindex json from file
        with open("effectindex.json") as f:
            self.effects_raw_json_data = json.load(f)

        # Parse json data into typed model
        self.effectindex: types_effectindex.EffectIndexRoot = (
            types_effectindex.EffectIndexRoot.parse_obj(self.effects_raw_json_data)
        )

        print("Parsed effectindex data: ", self.effectindex)

        self.next(self.save_effects)

    @step
    def save_effects(self):
        db = prisma.Prisma()
        db.connect()

        print("Transforming and storing effectindex data...")
        effects = self.effectindex.root

        for effect in effects:
            print("Processing effect: ", effect.title)

            # Continue loop if effect already exists in database
            if db.effect.find_first(where={"name": effect.title}):
                print("Effect already exists: ", effect.title)
                continue

            print("Inserting effect into the database")

            create_effect: EffectCreateInput = {
                "name": effect.title,
                # Parse "slug" from url (the last part of the url)
                # "https://psychonautwiki.org/wiki/MDMA" -> "MDMA"
                "slug": effect.url.split("/")[-1],
                "tags": "",
                "summary": effect.description,
                "description": effect.text,
                "parameters": "",
                "see_also": "",
                "effectindex": effect.url,
            }

            try:
                db_effect = db.effect.create(data=create_effect)

                print(f"Created {db_effect.name}", db_effect)
            except Exception:
                print(f"Failed to insert {effect.title}")
                continue

        self.next(self.connect_effectindex_with_psychonautwiki)

    # TODO: This needs to be implemented
    @step
    def connect_effectindex_with_psychonautwiki(self):
        """
        This step will extract all of the effects mentioned in psychonautwiki and connect them with the effects from effectindex.
        In the result effects in database will have url to psychoanautwiki's page.
        """

        db = prisma.Prisma()
        db.connect()

        # psychonautwiki.data.substances.*.effects -> deduplicate -> update database where entry do not have url to pw
        substances_by_psychonautwiki_json = self.psychonautwiki.data.substances

        for substance in substances_by_psychonautwiki_json:
            for effect in substance.effects:
                db_effect = db.effect.find_first(where={"name": effect.name})
                if db_effect and not db_effect.psychonautwiki:
                    db.effect.update(
                        where={"name": effect.name},
                        data={"psychonautwiki": effect.url},
                    )

                    print(f"Updated {effect.name}", db_effect)

        self.next(self.end)

    @step
    def end(self):
        """
        This is the 'end' step. All flows must have an 'end' step, which is the
        last step in the flow.

        """
        print("HelloFlow is all done.")


if __name__ == "__main__":
    GetPsychonautwiki()
