# Generated by ariadne-codegen
# Source: graphql/psychonautwiki/queries.graphql

from typing import List, Optional

from pydantic import Field

from .base_model import BaseModel


class AllSubstances(BaseModel):
    substances: Optional[List[Optional["AllSubstancesSubstances"]]]


class AllSubstancesSubstances(BaseModel):
    name: Optional[str]
    common_names: Optional[List[Optional[str]]] = Field(alias="commonNames")
    url: Optional[str]
    class_: Optional["AllSubstancesSubstancesClass"] = Field(alias="class")
    tolerance: Optional["AllSubstancesSubstancesTolerance"]
    roas: Optional[List[Optional["AllSubstancesSubstancesRoas"]]]
    addiction_potential: Optional[str] = Field(alias="addictionPotential")
    toxicity: Optional[List[Optional[str]]]
    cross_tolerances: Optional[List[Optional[str]]] = Field(alias="crossTolerances")
    uncertain_interactions: Optional[
        List[Optional["AllSubstancesSubstancesUncertainInteractions"]]
    ] = Field(alias="uncertainInteractions")
    unsafe_interactions: Optional[
        List[Optional["AllSubstancesSubstancesUnsafeInteractions"]]
    ] = Field(alias="unsafeInteractions")
    dangerous_interactions: Optional[
        List[Optional["AllSubstancesSubstancesDangerousInteractions"]]
    ] = Field(alias="dangerousInteractions")
    effects: Optional[List[Optional["AllSubstancesSubstancesEffects"]]]


class AllSubstancesSubstancesClass(BaseModel):
    chemical: Optional[List[Optional[str]]]
    psychoactive: Optional[List[Optional[str]]]


class AllSubstancesSubstancesTolerance(BaseModel):
    full: Optional[str]
    half: Optional[str]
    zero: Optional[str]


class AllSubstancesSubstancesRoas(BaseModel):
    name: Optional[str]
    dose: Optional["AllSubstancesSubstancesRoasDose"]
    duration: Optional["AllSubstancesSubstancesRoasDuration"]
    bioavailability: Optional["AllSubstancesSubstancesRoasBioavailability"]


class AllSubstancesSubstancesRoasDose(BaseModel):
    units: Optional[str]
    threshold: Optional[float]
    light: Optional["AllSubstancesSubstancesRoasDoseLight"]
    common: Optional["AllSubstancesSubstancesRoasDoseCommon"]
    strong: Optional["AllSubstancesSubstancesRoasDoseStrong"]
    heavy: Optional[float]


class AllSubstancesSubstancesRoasDoseLight(BaseModel):
    min: Optional[float]
    max: Optional[float]


class AllSubstancesSubstancesRoasDoseCommon(BaseModel):
    min: Optional[float]
    max: Optional[float]


class AllSubstancesSubstancesRoasDoseStrong(BaseModel):
    min: Optional[float]
    max: Optional[float]


class AllSubstancesSubstancesRoasDuration(BaseModel):
    onset: Optional["AllSubstancesSubstancesRoasDurationOnset"]
    comeup: Optional["AllSubstancesSubstancesRoasDurationComeup"]
    peak: Optional["AllSubstancesSubstancesRoasDurationPeak"]
    offset: Optional["AllSubstancesSubstancesRoasDurationOffset"]
    total: Optional["AllSubstancesSubstancesRoasDurationTotal"]
    afterglow: Optional["AllSubstancesSubstancesRoasDurationAfterglow"]


class AllSubstancesSubstancesRoasDurationOnset(BaseModel):
    min: Optional[float]
    max: Optional[float]
    units: Optional[str]


class AllSubstancesSubstancesRoasDurationComeup(BaseModel):
    min: Optional[float]
    max: Optional[float]
    units: Optional[str]


class AllSubstancesSubstancesRoasDurationPeak(BaseModel):
    min: Optional[float]
    max: Optional[float]
    units: Optional[str]


class AllSubstancesSubstancesRoasDurationOffset(BaseModel):
    min: Optional[float]
    max: Optional[float]
    units: Optional[str]


class AllSubstancesSubstancesRoasDurationTotal(BaseModel):
    min: Optional[float]
    max: Optional[float]
    units: Optional[str]


class AllSubstancesSubstancesRoasDurationAfterglow(BaseModel):
    min: Optional[float]
    max: Optional[float]
    units: Optional[str]


class AllSubstancesSubstancesRoasBioavailability(BaseModel):
    min: Optional[float]
    max: Optional[float]


class AllSubstancesSubstancesUncertainInteractions(BaseModel):
    name: Optional[str]


class AllSubstancesSubstancesUnsafeInteractions(BaseModel):
    name: Optional[str]


class AllSubstancesSubstancesDangerousInteractions(BaseModel):
    name: Optional[str]


class AllSubstancesSubstancesEffects(BaseModel):
    name: Optional[str]
    url: Optional[str]


AllSubstances.model_rebuild()
AllSubstancesSubstances.model_rebuild()
AllSubstancesSubstancesRoas.model_rebuild()
AllSubstancesSubstancesRoasDose.model_rebuild()
AllSubstancesSubstancesRoasDuration.model_rebuild()
