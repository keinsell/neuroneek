import json
from enum import Enum
from typing import Any, Optional

import requests
from metaflow import FlowSpec, step
from prisma.types import (
    DosageCreateInput,
    RouteOfAdministrationCreateInput,
    DosageWhereInput,
    EffectCreateInput,
    SubstanceCreateInput,
)

import codegen_types  # type: ignore
import prisma

# I could whitelist scrape to just Caffeine at this point lolz
IGNORE_SUBSTANCE_NAMES: list[str] = [
    "Selective serotonin reuptake inhibitor",
    "Stimulants",
    "Serotonin-norepinephrine reuptake inhibitor",
    "Serotonin",
    "Serotonergic psychedelic",
    "Sedative",
    "Depressant",
    "Deliriant",
    "Dissociative",
    "Empathogen-entactogen",
    "Stimulant",
    "Substituted amphetamines",
    "Substituted cathinones",
    "Substituted phenidates",
    "Substituted tryptamines",
    "Substituted phenethylamines",
    "Substituted morphinans",
    "Substituted cathinones",
    "Substituted amphetamines",
    "Substituted aminorexes",
]


# Define enum
class DosageIntensivity(str, Enum):
    threshold = ("threshold",)
    light = ("light",)
    common = ("common",)
    strong = ("strong",)
    heavy = "heavy"


def create_dosage_input(
    intensivity: DosageIntensivity,
    dose: codegen_types.psychonautwiki.Dose,
    route_of_administration: prisma.models.RouteOfAdministration,
) -> Optional[DosageCreateInput]:
    try:
        if intensivity in ["threshold", "heavy"]:
            return {
                "routeOfAdministrationId": route_of_administration.id,
                "intensivity": intensivity,
                "amount_min": dose.model_dump()[intensivity],
                "amount_max": dose.model_dump()[intensivity],
                "unit": dose.units,
            }
        else:
            # Avoid filling database with None values
            is_min_dosage_none = dose.model_dump()[intensivity]["min"] is None
            is_max_dosage_none = dose.model_dump()[intensivity]["max"] is None

            if is_max_dosage_none or is_min_dosage_none:
                return None

            # Return dosage input
            return {
                "routeOfAdministrationId": route_of_administration.id,
                "intensivity": intensivity,
                "amount_min": dose.model_dump()[intensivity]["min"],
                "amount_max": dose.model_dump()[intensivity]["max"],
                "unit": dose.units,
            }
    except Exception as e:
        print(f"Failed to extract data for {intensivity}: {e}")
        return None


def create_substance_input(
    substance: codegen_types.psychonautwiki.Substance,
) -> Optional[SubstanceCreateInput]:
    # If substance was blacklisted, return None
    if substance.name in IGNORE_SUBSTANCE_NAMES:
        return None
    # If substance do not have psychoactive class, return None
    if not substance or not substance.class_ or not substance.class_.psychoactive:
        return None

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

    return {
        "name": substance.name,
        "psychoactive_class": psychoactive_class,
        "brand_names": "",
        "chemical_class": chemical_class,
        "common_names": common_names,
    }


class GetPsychonautwiki(FlowSpec):
    def __init__(self, use_cli=True):
        super().__init__(use_cli)
        self.psychonautwiki_response: codegen_types.psychonautwiki.Model | None = None

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

        self.next(self.fetch_psychonautwiki)

    @step
    def fetch_psychonautwiki(self):
        graphql_query = {
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
            "https://api.psychonautwiki.org/", json=graphql_query, headers=None
        )

        response.raise_for_status()
        unknown_response_json = response.json()

        self.psychonautwiki_response = codegen_types.psychonautwiki.Model.parse_obj(
            unknown_response_json
        )

        # Save a local copy of the data in .out/psychonautwiki.json
        with open("../../psychonautwiki.json", "w") as outfile:
            json.dump(self.psychonautwiki_response.model_dump(), outfile, indent=2)

        self.next(self.import_substances)

    @step
    def import_substances(self):
        db = prisma.Prisma()
        db.connect()

        psychonautwiki_substances = codegen_types.psychonautwiki.Model.parse_obj(
            self.psychonautwiki_response
        ).data.substances

        # Parse data from GraphQL into Model and assign to workflow
        # noinspection PyAttributeOutsideInit
        self.psychonautwiki: codegen_types.psychonautwiki.Model = (
            codegen_types.psychonautwiki.Model.parse_obj(self.psychonautwiki_response)
        )

        for psychonautwiki_substance in psychonautwiki_substances:
            create_substance_payload = create_substance_input(psychonautwiki_substance)

            if not create_substance_payload:
                continue

            try:
                inserted_substance = db.substance.create(data=create_substance_payload)
                print(f"Imported {inserted_substance.name} ({inserted_substance.id})")
            except TypeError as e:
                print(f"Failed to insert {psychonautwiki_substance.name}: ", e)
                raise Exception(
                    "There was problem with insertion to database which should be successful."
                )

        self.next(self.legacy_import_route_of_administration)

    @step
    def legacy_import_route_of_administration(self):
        """
        For each substance in a database we will explore the route of administration in the provided
        dataset, if one exists in a database the insertion will be skipped nad if not it will be inserted.
        """

        db = prisma.Prisma()
        db.connect()

        substances = db.substance.find_many()

        for substance in substances:
            print("Processing substance: ", substance.name)

            # Find substance in psychonautwiki dataset available in class.
            psychonautwiki_substances = codegen_types.psychonautwiki.Model.parse_obj(
                self.psychonautwiki
            ).data.substances

            pw_substance = next(
                (
                    pw_substance
                    for pw_substance in psychonautwiki_substances
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

        self.next(self.create_dosage)

    @step
    def create_dosage(self):
        # TODO: This step should take a dosage from route of administration
        # and validate against null values - in database we should not allow
        # for any case of null values in dosages and all units specified must
        # be actually units of mass - every other should be most likely avoided
        # and not saved to database.
        db = prisma.Prisma()
        db.connect()

        substances = db.substance.find_many()

        for substance in substances:
            psychonautwiki_substances = codegen_types.psychonautwiki.Model.parse_obj(
                self.psychonautwiki
            ).data.substances

            pw_substance = next(
                (
                    pw_substance
                    for pw_substance in psychonautwiki_substances
                    if pw_substance.name == substance.name
                ),
                None,
            )

            if not pw_substance:
                print("Substance not found in PsychonautWiki dataset")
                continue

            roas = pw_substance.roas

            if not roas:
                print("No route of administration found for substance")
                continue

            for roa in roas:
                print("Processing route of administration: ", roa.name)

                db_roa = db.routeofadministration.find_first(
                    where={"name": roa.name, "substanceName": pw_substance.name}
                )

                if not db_roa:
                    print("Route of administration not found in the database")
                    continue

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

                    dose_input = create_dosage_input(
                        DosageIntensivity(intensivity), dose, db_roa
                    )

                    if not dose_input:
                        print(
                            f"Failed to create dosage input for {intensivity}: {dose.model_dump_json()}"
                        )
                        continue

                    try:
                        dosage_find_first_query: DosageWhereInput = {
                            "routeOfAdministrationId": db_roa.id,
                            "intensivity": intensivity,
                        }

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
        with open("../.cached_data/effectindex.json") as f:
            self.effects_raw_json_data = json.load(f)

        # Parse json data into typed model
        self.effectindex: codegen_types.effectindex.Model = (
            codegen_types.effectindex.Model.parse_obj(self.effects_raw_json_data)
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

        self.next(self.merge_effect_references)

    # TODO: This needs to be implemented
    @step
    def merge_effect_references(self):
        """
        This step will extract all the effects mentioned in psychonautwiki and connect them with the effects from effectindex.
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
