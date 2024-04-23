import json
from typing import Any

import requests
from metaflow import FlowSpec, step

import prisma
import pw_types


class GetPsychonautwiki(FlowSpec):
    """
    A flow where Metaflow prints 'Hi'.

    Run this flow to validate that Metaflow is installed correctly.

    """

    def __init__(self, use_cli=True):
        super().__init__(use_cli)
        self.raw_json_data: Any = None
        self.psychonautwiki: pw_types.Model

    @step
    def start(self):
        """
        This is the 'start' step. All flows must have a step named 'start' that
        is the first step in the flow.

        """
        print("HelloFlow is starting...")
        self.next(self.get_psychonautwiki)

    @step
    def get_psychonautwiki(self):
        """
        A step to get data from PsychonautWiki API.

        """
        from metaflow import Flow, get_metadata

        print("Using metadata provider: %s" % get_metadata())

        run = Flow("GetPsychonautwiki").latest_successful_run
        print("Using analysis from '%s'" % str(run))

        if not run:
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
            self.raw_json_data = run.data.raw_json_data
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

        for pw_substance in substances:
            substance = pw_types.Substance.parse_obj(pw_substance)

            # If substance name is in array of ingored substances, skip it
            if substance.name in [
                "Selective serotonin reuptake inhibitor",
                "Stimulants",
                "Serotonin-norepinephrine reuptake inhibitor",
                "Serotonin",
                "Serotonergic psychedelic",
                "Sedative",
                "Depressant",
                "Deliriant",
            ]:
                continue

            # Skip substance if name starts with Substituted
            if substance.name.startswith("Substituted"):
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
                ",".join(substance.commonNames)
                if substance.commonNames
                else ""
            )

            try:
                db_substance = db.substance.upsert(
                    where={"name": substance.name},
                    data={
                        "create": {
                            "name": substance.name,
                            "psychoactive_class": psychoactive_class,
                            "chemical_class": chemical_class,
                            "common_names": common_names,
                        },
                        "update": {
                            "name": substance.name,
                            "psychoactive_class": psychoactive_class,
                            "chemical_class": chemical_class,
                            "common_names": common_names,
                        },
                    },
                )

                print(f"Upserted {db_substance.name}", db_substance)
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
                db_roa = db.route_of_administration.find_first(
                    where={"name": roa.name, "substance": {"name": pw_substance.name}}
                )

                if db_roa:
                    print("Route of administration already exists in the database")
                    continue

                print("Inserting route of administration into the database")

                try:
                    db_roa = db.roa.create(
                        {
                            "name": roa["name"],
                            "substance": {"connect": {"name": substance.name}},
                        }
                    )
                    print(f"Inserted {db_roa.name}", db_roa)
                except Exception:
                    print(f"Failed to insert {roa['name']}")
                    continue

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
