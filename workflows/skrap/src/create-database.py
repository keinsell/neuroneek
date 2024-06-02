import json

from pubchempy import Compound

import custom_types
import prisma
from dataclasses import dataclass
from enum import Enum
from typing import Optional
import pubchempy as pcp
from diskcache import Cache
from metaflow import FlowSpec, step
from prisma.types import (
    DosageCreateInput,
    RouteOfAdministrationCreateInput,
    DosageWhereInput,
    EffectCreateInput,
    SubstanceCreateInput,
    RouteOfAdministrationWhereInput,
)

from graphql_client import GraphQLClientGraphQLMultiError, PsychonautwikiSubstance
from graphql_client.client import Client as PsychonautwikiGraphqlClient
import asyncio


cache = Cache(directory=".cache")

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


class DosageUnit(str, Enum):
    microgram = ("μg",)
    milligram = ("mg",)
    gram = ("g",)


class RouteOfAdministrationClassification(str, Enum):
    oral = ("oral",)
    sublingual = ("sublingual",)
    buccal = ("buccal",)
    insufflated = ("insufflated",)
    rectal = ("rectal",)
    transdermal = ("transdermal",)
    subcutaneous = ("subcutaneous",)
    intramuscular = ("intramuscular",)
    interavenous = ("interavenous",)
    smoked = ("smoked",)


class PhaseClassification(str, Enum):
    onset = ("onset",)
    comeup = ("comeup",)
    peak = ("peak",)
    offset = ("offset",)
    total = ("total",)
    afterglow = ("afterglow",)


@dataclass
class DosageRange:
    """Represents a range of dosage values with associated categories."""

    min_value: float
    max_value: float
    category: DosageIntensivity

    @classmethod
    def under_threshold(cls, max_value):
        return cls(float("-inf"), max_value, DosageIntensivity.threshold)

    @classmethod
    def light(cls, min_value, max_value):
        return cls(min_value, max_value, DosageIntensivity.light)

    @classmethod
    def common(cls, min_value, max_value):
        return cls(min_value, max_value, DosageIntensivity.common)

    @classmethod
    def strong(cls, min_value, max_value):
        return cls(min_value, max_value, DosageIntensivity.strong)

    @classmethod
    def heavy(cls, min_value):
        return cls(min_value, float("inf"), DosageIntensivity.heavy)

    def __contains__(self, dosage):
        """Allows checking if a dosage is within this range."""
        return self.min_value <= dosage <= self.max_value


def create_dosage_input(
    intensivity: DosageIntensivity,
    dose: custom_types.psychonautwiki.Dose,
    route_of_administration: prisma.models.RouteOfAdministration,
) -> Optional[DosageCreateInput]:
    try:
        if intensivity is DosageIntensivity.heavy:
            # Expect heavy dosage to be present and use it as
            # lower and upper bound for min and max dosage.
            if not dose.heavy:
                return None

            dosage_range = DosageRange.heavy(dose.heavy)

            return {
                "routeOfAdministrationId": route_of_administration.id,
                "intensivity": intensivity.lower(),
                "amount_min": dosage_range.min_value,
                "amount_max": dosage_range.max_value,
                "unit": dose.units,
            }
        if intensivity is DosageIntensivity.threshold:
            # Expect threshold dosage to be present and use it as
            # lower and upper bound for min and max dosage.
            if not dose.threshold:
                return None

            dosage_range = DosageRange.under_threshold(dose.threshold)

            return {
                "routeOfAdministrationId": route_of_administration.id,
                "intensivity": intensivity.lower(),
                "amount_min": dosage_range.min_value,
                "amount_max": dosage_range.max_value,
                "unit": DosageUnit(dose.units),
            }

            # Avoid filling database with None values
        is_min_dosage_none = dose.model_dump()[intensivity]["min"] is None
        is_max_dosage_none = dose.model_dump()[intensivity]["max"] is None

        if is_max_dosage_none or is_min_dosage_none:
            return None

        dosage_range = DosageRange(
            dose[intensivity]["min"],
            dose[intensivity]["max"],
            DosageIntensivity(intensivity),
        )

        # Return dosage input
        return DosageCreateInput(
            routeOfAdministrationId=route_of_administration.id,
            intensivity=intensivity.lower(),
            amount_min=dosage_range.min_value,
            amount_max=dosage_range.max_value,
            unit=DosageUnit(dose.units),
        )
    except Exception as e:
        print(f"Failed to extract data for {intensivity}: {e}")
        return None


def create_route_of_administration_input(
    psychonautwiki_roa: custom_types.psychonautwiki.Roa,
    substance: prisma.models.Substance,
) -> Optional[RouteOfAdministrationCreateInput]:
    if not psychonautwiki_roa:
        return None

    try:
        classification = RouteOfAdministrationClassification(
            psychonautwiki_roa.name.lower()
        )

        return RouteOfAdministrationCreateInput(
            classification=classification,
            substanceName=substance.name,
        )
    except Exception:
        return None


@cache.memoize()
def fetch_pubchem(substance_name: str) -> Optional[pcp.Compound]:
    """
    Fetches the PubChem data for a given substance name.
    With caching mechanism based on local filesystem.
    """
    try:
        # Check if the substance is in the cache
        if substance_name in cache:
            return cache[substance_name]

        # If not in cache, fetch the substance data
        substance = pcp.get_compounds(substance_name, "name")[0]

        if not substance:
            return None

        # Store the fetched data in cache
        cache[substance_name] = substance

        # Return the PubChem data
        return substance
    except Exception:
        return None


async def fetch_psychaonutwiki() -> list[PsychonautwikiSubstance]:
    try:
        client = PsychonautwikiGraphqlClient(
            url="https://api.psychonautwiki.org/graphql"
        )
        all_substances = await client.all_substances()

        if not all_substances:
            raise Exception("No substances found in PsychonautWiki dataset")

        return all_substances
    except GraphQLClientGraphQLMultiError as e:
        if e.data:
            from graphql_client import AllSubstances

            substances = AllSubstances.model_validate(e.data).substances

            if substances:
                return substances
        raise e


def create_substance_input(
    substance: PsychonautwikiSubstance,
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
        ",".join(substance.common_names) if substance.common_names else ""
    )

    pubchem: Compound | None = fetch_pubchem(substance.name)

    # Do not support custom substances as they will cause
    # problems with data integrity later on, neuronek
    # is not replacing psychonautwiki to contain all of
    # its information - instead we're creating more
    # detailed and safe datamodel for substances.
    if not pubchem:
        return None

    return SubstanceCreateInput(
        name=substance.name,
        psychoactive_class=psychoactive_class,
        chemical_class=chemical_class,
        common_names=common_names,
        brand_names="",
        smiles=pubchem.isomeric_smiles,
        systematic_name=pubchem.iupac_name,
        inchi_key=pubchem.inchikey,
        pubchem_cid=pubchem.cid,
        psychonautwiki_url=substance.url,
    )


def get_psychonautwiki_substance_by_name_or_panic(
    name: str, psychonautwiki_substances: list[PsychonautwikiSubstance]
) -> PsychonautwikiSubstance:
    maybe_substance = next(
        (
            pw_substance
            for pw_substance in psychonautwiki_substances
            if pw_substance.name == name
        ),
        None,
    )

    if not maybe_substance:
        print(f"Substance {name} not found in PsychonautWiki dataset")
        raise Exception(f"Substance {name} not found in PsychonautWiki dataset")

    return maybe_substance


def get_psychnautwiki_route_of_administration_by_substance_name_or_panic(
    name: str, psychonautwiki_substances: list[PsychonautwikiSubstance]
) -> list[custom_types.psychonautwiki.Roa]:
    maybe_substance = next(
        (
            pw_substance
            for pw_substance in psychonautwiki_substances
            if pw_substance.name == name
        ),
        None,
    )

    if not maybe_substance:
        print(f"Substance {name} not found in PsychonautWiki dataset")
        raise Exception(f"Substance {name} not found in PsychonautWiki dataset")

    return maybe_substance.roas


class CreateDatabase(FlowSpec):
    def __init__(self, use_cli=True):
        super().__init__(use_cli)
        self.psychonautwiki_substances: list[PsychonautwikiSubstance] = []

    # noinspection PyUnusedFunction
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

        self.next(self.fetch_psychonautwikiv2)

    @step
    def fetch_psychonautwikiv2(self):
        response = asyncio.run(fetch_psychaonutwiki())
        self.psychonautwiki_substances = response
        self.next(self.import_substances)

    @step
    def import_substances(self):
        db = prisma.Prisma()
        db.connect()

        psychonautwiki_substances = self.psychonautwiki_substances

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
            try:
                psychonautwiki_roa = get_psychnautwiki_route_of_administration_by_substance_name_or_panic(
                    substance.name, self.psychonautwiki_substances
                )

                for roa in psychonautwiki_roa:
                    create_route_of_administration_payload = (
                        create_route_of_administration_input(roa, substance)
                    )

                    if not create_route_of_administration_payload:
                        continue

                    try:
                        db_roa = db.routeofadministration.create(
                            data=create_route_of_administration_payload
                        )
                        print(
                            f"Created {db_roa.classification} for {db_roa.substanceName}"
                        )
                    except TypeError as e:
                        print(f"Failed to insert {roa.name} for {substance.name}: ", e)
                        continue
            except Exception:
                continue

        self.next(self.create_dosage)

    @step
    def create_dosage(self):
        db = prisma.Prisma()
        db.connect()

        substances = db.substance.find_many()

        for substance in substances:
            pw_substance = get_psychonautwiki_substance_by_name_or_panic(
                substance.name, self.psychonautwiki_substances
            )

            if not pw_substance:
                continue

            roas = pw_substance.roas

            if not roas:
                print("No route of administration found for substance")
                continue

            for roa in roas:
                print("Processing route of administration: ", roa.name)

                db_roa = db.routeofadministration.find_first(
                    where=RouteOfAdministrationWhereInput(
                        classification=roa.name, substanceName=substance.name
                    )
                )

                if not db_roa:
                    continue

                dose = roa.dose

                if not dose:
                    print("No dosage found for route of administration")
                    continue

                print("Processing dosage for route of administration: ", roa.name)

                dosage_intensiveness = [
                    "threshold",
                    "light",
                    "common",
                    "strong",
                    "heavy",
                ]

                for intensity in dosage_intensiveness:
                    dose_input = create_dosage_input(
                        DosageIntensivity(intensity), dose, db_roa
                    )

                    if not dose_input:
                        continue

                    try:
                        dosage_find_first_query: DosageWhereInput = {
                            "routeOfAdministrationId": db_roa.id,
                            "intensivity": intensity,
                        }

                        db_dose = db.dosage.find_first(where=dosage_find_first_query)

                        if db_dose:
                            print(
                                f"{intensity} dosage for {roa.name} of {substance.name} already exists in the database"
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

    def import_phases(self):
        """
        Step will parse information from psychonautwiki to add durations for each
        route of administration that was imported before.
        """
        db = prisma.Prisma()
        db.connect()

        routes_of_administration = db.routeofadministration.find_many()

        for route_of_administration in routes_of_administration:
            # Find substance in psychonautwiki dataset available in class.
            psychonautwiki_substances = custom_types.psychonautwiki.Model.parse_obj(
                self.psychonautwiki
            ).data.substances

        self.next(self.import_effects)

    @step
    def import_effects(self):
        # Read effectindex json from file
        with open("../.cached_data/effectindex.json") as f:
            self.effects_raw_json_data = json.load(f)

        # Parse json data into typed model
        self.effectindex: custom_types.effectindex.Model = (
            custom_types.effectindex.Model.parse_obj(self.effects_raw_json_data)
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
    CreateDatabase(use_cli=True)
