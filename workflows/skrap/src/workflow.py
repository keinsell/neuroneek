import asyncio
import json
from dataclasses import dataclass
from enum import Enum
from typing import Literal, Optional

import pint
import prisma.models
import quantities.quantity

import custom_types
import joblib
import pendulum
import pubchempy as pcp
import quantities
from diskcache import Cache
from metaflow import FlowSpec, step
from pubchempy import Compound
from neuronek import DosageIntensivity, DosageUnit

import graphql_client
import prisma

from graphql_client import (
    GraphQLClientGraphQLMultiError,
    AllSubstancesSubstances,
)
from graphql_client import Client as PsychonautwikiGraphqlClient
from prisma.types import (
    DosageCreateInput,
    EffectCreateInput,
    RouteOfAdministrationCreateInput,
    SubstanceCreateInput,
    PhaseCreateInput,
)

# try:
#     pydevd_pycharm.settrace(
#         "localhost", port=8938, stdoutToServer=True, stderrToServer=True
#     )
# finally:
#     print("Stopping debugger")

cache = Cache(directory=".cache")
memory = joblib.Memory(".cache", verbose=0)


def parse_mass_by_f32_and_unit(value: float, unit: str):
    return quantities.quantity.Quantity(
        value,
        unit,
    )


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

    @staticmethod
    def from_string(name: str) -> "RouteOfAdministrationClassification":
        match name:
            case "oral":
                return RouteOfAdministrationClassification.oral
            case "sublingual":
                return RouteOfAdministrationClassification.sublingual
            case "buccal":
                return RouteOfAdministrationClassification.buccal
            case "insufflated":
                return RouteOfAdministrationClassification.insufflated
            case "rectal":
                return RouteOfAdministrationClassification.rectal
            case "transdermal":
                return RouteOfAdministrationClassification.transdermal
            case "subcutaneous":
                return RouteOfAdministrationClassification.subcutaneous
            case "intramuscular":
                return RouteOfAdministrationClassification.intramuscular
            case "interavenous":
                return RouteOfAdministrationClassification.interavenous
            case "smoked":
                return RouteOfAdministrationClassification.smoked
            case _:
                raise ValueError(f"Unknown classification: {name}")


class PhaseClassification(str, Enum):
    onset = ("onset",)
    comeup = ("comeup",)
    peak = ("peak",)
    offset = ("offset",)
    afterglow = ("afterglow",)

    @classmethod
    def __from_psychonautwiki_duration___(
        self, input: Literal["onset", "comeup", "peak", "asddsad", "asddsa", "asd"]
    ) -> "PhaseClassification":
        match input:
            case "onset":
                return PhaseClassification.onset
            case "comeup":
                return PhaseClassification.comeup
            case "peak":
                return PhaseClassification.peak
            case "offset":
                return PhaseClassification.offset
            case "afterglow":
                return PhaseClassification.afterglow
            case _:
                raise NotImplementedError()


ureg = pint.UnitRegistry()


def parse_mass_pint(text):
    try:
        quantity = ureg.parse_expression(text)
        print(quantity)
        return quantity
    except pint.errors.UndefinedUnitError as e:
        print(f"Failed to parse {text}: ", e)
        return None


@dataclass
class DosageRange:
    """Represents a range of dosage values with associated categories."""

    min_value: float
    max_value: float
    classification: DosageIntensivity
    unit: DosageUnit

    @classmethod
    def under_threshold(cls, max_value, unit):
        return cls(
            0,
            max_value,
            DosageIntensivity.threshold,
            unit,
        )

    @classmethod
    def light(cls, min_value, max_value, unit):
        return cls(min_value, max_value, DosageIntensivity.light, unit)

    @classmethod
    def common(cls, min_value, max_value, unit):
        return cls(min_value, max_value, DosageIntensivity.common, unit)

    @classmethod
    def strong(cls, min_value, max_value, unit):
        return cls(min_value, max_value, DosageIntensivity.strong, unit)

    @classmethod
    def heavy(cls, min_value, unit):
        return cls(min_value, 0, DosageIntensivity.heavy, unit)

    def __contains__(self, dosage):
        """Allows checking if a dosage is within this range."""
        return self.min_value <= dosage <= self.max_value

    @staticmethod
    def from_psychonautwiki_dosage(
        dose: graphql_client.AllSubstancesSubstancesRoasDose,
        intensivity: DosageIntensivity,
    ):
        # print(
        #     "Constructing DosageRange.from_psychonautwiki_dosage with:",
        #     dose,
        #     intensivity,
        # )

        def match_dosage_range(intensivity: DosageIntensivity):
            match intensivity:
                case DosageIntensivity.threshold:
                    return DosageRange.under_threshold(dose.threshold, dose.units)
                case DosageIntensivity.light:
                    return DosageRange.light(dose.light.min, dose.light.max, dose.units)
                case DosageIntensivity.common:
                    return DosageRange.common(
                        dose.common.min, dose.common.max, dose.units
                    )
                case DosageIntensivity.strong:
                    return DosageRange.strong(
                        dose.strong.min, dose.strong.max, dose.units
                    )
                case DosageIntensivity.heavy:
                    return DosageRange.heavy(dose.heavy, dose.units)
                case _:
                    raise Exception(f"Unknown DosageIntensivity: {intensivity}")

        dosage_range = match_dosage_range(intensivity)

        return dosage_range


@dataclass
class PhaseRange:
    """Represents a range of phase values with associated categories."""

    min_value: pendulum.Duration
    max_value: pendulum.Duration
    classification: PhaseClassification

    @classmethod
    def onset(cls, min_value, max_value):
        return cls(min_value, max_value, PhaseClassification.onset)

    @classmethod
    def comeup(cls, min_value, max_value):
        return cls(min_value, max_value, PhaseClassification.comeup)

    @classmethod
    def peak(cls, min_value, max_value):
        return cls(min_value, max_value, PhaseClassification.peak)

    @classmethod
    def offset(cls, min_value, max_value):
        return cls(min_value, max_value, PhaseClassification.offset)

    @classmethod
    def afterglow(cls, min_value, max_value):
        return cls(min_value, max_value, PhaseClassification.afterglow)

    @staticmethod
    def from_psychonautwiki_duration(
        classification: PhaseClassification,
        min_duraation_input: float,
        max_duration_input: float,
        duration_unit: str,
    ):
        min_duration: pendulum.Duration = None
        max_duration: pendulum.Duration = None

        if duration_unit == "hours":
            min_duration = pendulum.Duration(hours=min_duraation_input)
            max_duration = pendulum.Duration(hours=max_duration_input)
        elif duration_unit == "minutes":
            min_duration = pendulum.Duration(minutes=min_duraation_input)
            max_duration = pendulum.Duration(minutes=max_duration_input)
        elif duration_unit == "seconds":
            min_duration = pendulum.Duration(seconds=min_duraation_input)
            max_duration = pendulum.Duration(seconds=max_duration_input)
        else:
            raise ValueError(f"Unknown duration unit: {duration_unit}")

        assert min_duration <= max_duration
        # Check if min_duration and max_duration are instance of pendulum.Duration
        assert isinstance(min_duration, pendulum.Duration)
        assert isinstance(max_duration, pendulum.Duration)

        match classification:
            case PhaseClassification.onset:
                return PhaseRange.onset(min_duration, max_duration)
            case PhaseClassification.comeup:
                return PhaseRange.comeup(min_duration, max_duration)
            case PhaseClassification.peak:
                return PhaseRange.peak(min_duration, max_duration)
            case PhaseClassification.offset:
                return PhaseRange.offset(min_duration, max_duration)
            case PhaseClassification.afterglow:
                return PhaseRange.afterglow(min_duration, max_duration)
            case _:
                raise ValueError(f"Unknown classification: {classification}")


def create_dosage_input(
    dosage_range: DosageRange,
    route_of_administration: prisma.models.RouteOfAdministration,
) -> Optional[DosageCreateInput]:
    try:
        create_dosage = DosageCreateInput(
            routeOfAdministrationId=route_of_administration.id,
            intensivity=dosage_range.classification.lower(),
            amount_min=dosage_range.min_value,
            amount_max=dosage_range.max_value,
            unit=dosage_range.unit,
        )
        print("Constructed DosageCreateInput", create_dosage)
        return create_dosage
    except Exception as e:
        print(f"Failed to extract data for {dosage_range.classification}: {e}")
        return None


def create_route_of_administration_input(
    psychonautwiki_roa: graphql_client.AllSubstancesSubstancesRoas,
    substance: prisma.models.Substance,
) -> Optional[RouteOfAdministrationCreateInput]:
    if not psychonautwiki_roa or not psychonautwiki_roa.name:
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


@memory.cache()
async def fetch_pubchem(substance_name: str) -> Optional[pcp.Compound]:
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


@memory.cache
async def fetch_psychaonutwiki() -> list[AllSubstancesSubstances]:
    client = PsychonautwikiGraphqlClient(url="https://api.psychonautwiki.org/graphql")

    try:
        all_substances = await client.all_substances()
        assert all_substances is not None
        # print(all_substances)
        return all_substances

    except GraphQLClientGraphQLMultiError as e:
        if e.data:
            from graphql_client import AllSubstances

            substances = AllSubstances.model_validate(e.data).substances
            assert substances is not None
            # print(substances)
            return substances
        raise e


async def create_substance_input(
    substance: AllSubstancesSubstances,
) -> Optional[SubstanceCreateInput]:
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

    pubchem: Compound | None = await fetch_pubchem(substance.name)

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
    name: str, psychonautwiki_substances: list[AllSubstancesSubstances]
) -> AllSubstancesSubstances:
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
    name: str, psychonautwiki_substances: list[AllSubstancesSubstances]
) -> list[graphql_client.AllSubstancesSubstancesRoas]:
    maybe_substance = next(
        (
            pw_substance
            for pw_substance in psychonautwiki_substances
            if pw_substance.name == name
        ),
        None,
    )

    if not maybe_substance or not maybe_substance.roas:
        print(f"Substance {name} not found in PsychonautWiki dataset")
        raise Exception(f"Substance {name} not found in PsychonautWiki dataset")

    roas_without_nulls = list(filter(None, maybe_substance.roas))
    return roas_without_nulls


def get_psychonautwiki_route_of_administration_by_classification_from_singular_substance_or_panic(
    classification: RouteOfAdministrationClassification,
    substance: AllSubstancesSubstances,
) -> graphql_client.AllSubstancesSubstancesRoas:
    if not substance or not substance.roas:
        print(f"Substance {substance.name} not found in PsychonautWiki dataset")
        raise Exception(
            f"Substance {substance.name} not found in PsychonautWiki dataset"
        )

    roas_without_nulls = list(filter(None, substance.roas))

    for roa in roas_without_nulls:
        if RouteOfAdministrationClassification(roa.name) == classification:
            return roa

    raise Exception(
        f"No route of administration with classification {classification} found in {substance.name}"
    )


def create_phase_ranges_from_psychonautwiki_duration(
    roa_duration: graphql_client.AllSubstancesSubstancesRoasDuration,
) -> list[PhaseRange]:
    phase_ranges = []
    for phase in PhaseClassification:
        phase_duration = getattr(roa_duration, phase, None)

        if (
            (not phase_duration)
            or (phase_duration.min is None)
            or (phase_duration.max is None)
            or (phase_duration.units is None)
        ):
            continue

        if phase_duration:
            phase_range = PhaseRange.from_psychonautwiki_duration(
                PhaseClassification(phase),
                phase_duration.min,
                phase_duration.max,
                phase_duration.units,
            )

            phase_ranges.append(phase_range)
    print("create_phase_ranges_from_psychonautwiki_duration", phase_ranges)
    return phase_ranges


def prisma_create_phase_input(
    phase_range: PhaseRange,
    route_of_administration_id: str,
) -> PhaseCreateInput:
    return PhaseCreateInput(
        routeOfAdministrationId=route_of_administration_id,
        from_duration=int(round(phase_range.min_value.seconds)),
        to_duration=int(round(phase_range.max_value.seconds)),
    )


def get_psychonautwiki_duration_by_substance_name_and_roa_classification_or_panic(
    name: str,
    classification: RouteOfAdministrationClassification,
    psychonautwiki_substances: list[AllSubstancesSubstances],
) -> list[PhaseRange]:
    substance = get_psychonautwiki_substance_by_name_or_panic(
        name, psychonautwiki_substances
    )
    roa = get_psychonautwiki_route_of_administration_by_classification_from_singular_substance_or_panic(
        classification, substance
    )

    assert roa.duration, f"No route of administration found for {name}"

    durations: list[PhaseRange] = create_phase_ranges_from_psychonautwiki_duration(
        roa.duration
    )

    return durations


class CreateDatabase(FlowSpec):
    def __init__(self, use_cli=True):
        super().__init__(use_cli)
        self.psychonautwiki_substances: list[AllSubstancesSubstances] = []

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
        db.phase.delete_many()
        db.routeofadministration.delete_many()
        db.substance.delete_many()
        db.effect.delete_many()

        self.next(self.fetch_psychonautwiki)

    @step
    def fetch_psychonautwiki(self):
        response = asyncio.run(fetch_psychaonutwiki())
        self.psychonautwiki_substances = response
        self.next(self.import_substances)

    @step
    def import_substances(self):
        db = prisma.Prisma()
        db.connect()

        psychonautwiki_substances = self.psychonautwiki_substances

        async def process_substance(psychonautwiki_substance):
            create_substance_payload = await create_substance_input(
                psychonautwiki_substance
            )

            if not create_substance_payload:
                print(f"Skipping {psychonautwiki_substance.name}")
                return

            try:
                inserted_substance = db.substance.create(data=create_substance_payload)
                print(f"Imported {inserted_substance.name}")
            except TypeError as e:
                print(f"Failed to insert {psychonautwiki_substance.name}: ", e)
                raise e

            pass

        async def run_tasks():
            tasks = [
                process_substance(substance) for substance in psychonautwiki_substances
            ]
            await asyncio.gather(*tasks)

        asyncio.run(run_tasks())

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
        routes_of_administration = db.routeofadministration.find_many()

        for route_of_administration in routes_of_administration:
            try:
                route_of_administration_classification = (
                    RouteOfAdministrationClassification.from_string(
                        route_of_administration.classification
                    )
                )

                psychonautwiki_substance = (
                    get_psychonautwiki_substance_by_name_or_panic(
                        route_of_administration.substanceName,
                        self.psychonautwiki_substances,
                    )
                )

                psychonautwiki_dosages: graphql_client.AllSubstancesSubstancesRoasDose = get_psychonautwiki_route_of_administration_by_classification_from_singular_substance_or_panic(
                    route_of_administration_classification,
                    psychonautwiki_substance,
                ).dose

                dosage_intensivities = [
                    DosageIntensivity.threshold,
                    DosageIntensivity.light,
                    DosageIntensivity.common,
                    DosageIntensivity.strong,
                    DosageIntensivity.heavy,
                ]

                for intensity in dosage_intensivities:
                    dosage_range = DosageRange.from_psychonautwiki_dosage(
                        psychonautwiki_dosages, intensity
                    )
                    create_dosage_input_payload = create_dosage_input(
                        dosage_range, route_of_administration
                    )

                    db.dosage.create(create_dosage_input_payload)
            except Exception as e:
                print(
                    f"Failed to create dosage for {route_of_administration.substanceName}: ",
                    e,
                )
                continue

        self.next(self.import_phases)

    @step
    def import_phases(self):
        """
        Step will parse information from psychonautwiki to add durations for each
        route of administration that was imported before.
        """
        db = prisma.Prisma()
        db.connect()

        routes_of_administration = db.routeofadministration.find_many()

        for route_of_administration in routes_of_administration:
            try:
                routes_of_administration_from_psychonautwiki = get_psychnautwiki_route_of_administration_by_substance_name_or_panic(
                    route_of_administration.substanceName,
                    self.psychonautwiki_substances,
                )

                for (
                    route_of_administration_from_psychonautwiki
                ) in routes_of_administration_from_psychonautwiki:
                    print(route_of_administration_from_psychonautwiki)

                    phases = get_psychonautwiki_duration_by_substance_name_and_roa_classification_or_panic(
                        route_of_administration.substanceName,
                        RouteOfAdministrationClassification(
                            route_of_administration_from_psychonautwiki.name
                        ),
                        self.psychonautwiki_substances,
                    )

                    print(
                        "get_psychonautwiki_duration_by_substance_name_and_roa_classification_or_panic"
                    )
                    print(
                        phases,
                    )

                    for phase_range in phases:
                        create_phase_input = prisma_create_phase_input(
                            phase_range, route_of_administration.id
                        )
                        created_phase = db.phase.create(create_phase_input)
                        print("Created phase", created_phase)

            except Exception as e:
                print(
                    f"Failed to import phases for {route_of_administration.substanceName}: {e}"
                )
                continue

        self.next(self.load_effects)

    @step
    def load_effects(self):
        # Read effectindex json from file
        with open("public/effectindex.json") as f:
            self.effects_raw_json_data = json.load(f)

        # Parse json data into typed model
        self.effectindex: custom_types.effectindex.Model = (
            custom_types.effectindex.Model.parse_obj(self.effects_raw_json_data)
        )

        self.next(self.import_effects)

    @step
    def import_effects(self):
        db = prisma.Prisma()
        db.connect()
        effects = self.effectindex.root

        for effect in effects:
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
                print(f"Created {db_effect.name}")
            except Exception as e:
                print(f"Failed to insert {effect.title}: ", e)
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

        for substance in self.psychonautwiki_substances:
            if not substance.effects:
                continue

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
