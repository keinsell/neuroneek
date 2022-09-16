import { Entity } from "../../../common/entity/entity.common";
import { Effect } from "../../effects/entities/effect.entity";
import { ChemicalDetails } from "./chemical-details.entity";
import { ChemicalNomenclature } from "./chemical-nomenclature";
import { ClassMembership } from "./class-membership.entity";
import {
  RouteOfAdministration,
  RouteOfAdministrationType,
} from "./route-of-administration.entity";

export interface SubstanceProperties {
  name: string;
  chemnicalNomencalture: ChemicalNomenclature;
  chemicalDetails?: ChemicalDetails;
  classMembership: ClassMembership;
  administrationRoutes: RouteOfAdministration[];
  effects: Effect[];
}

export class Substance extends Entity implements SubstanceProperties {
  name: string;
  chemnicalNomencalture: ChemicalNomenclature;
  chemicalDetails?: ChemicalDetails | undefined;
  classMembership: ClassMembership;
  administrationRoutes: RouteOfAdministration[];
  effects: Effect[];

  constructor(properties: SubstanceProperties, id?: string | number) {
    super(id);
    this.name = properties.name;
    this.chemnicalNomencalture = properties.chemnicalNomencalture;
    this.chemicalDetails = properties.chemicalDetails;
    this.classMembership = properties.classMembership;
    this.administrationRoutes = properties.administrationRoutes;
    this.effects = properties.effects ?? [];
  }

  getAvailableAdministrationRoutes() {
    return Object.values(this.administrationRoutes).map(
      (entity) => entity.route
    );
  }

  getDosageClassification(dosage: number, route: RouteOfAdministrationType) {
    const routeOfAdministration = this.administrationRoutes.find(
      (v) => v.route === route
    );

    if (!routeOfAdministration) {
      throw Error("No route of administration found");
    }

    const { dosage: substanceDosage } = routeOfAdministration;

    let classification = "unknown";

    if (
      dosage > substanceDosage.thereshold ||
      dosage < substanceDosage.thereshold
    ) {
      classification = "thereshold";
    }

    if (dosage >= substanceDosage.light) {
      classification = "light";
    }

    if (dosage >= substanceDosage.moderate) {
      classification = "moderate";
    }

    if (dosage >= substanceDosage.strong) {
      classification = "strong";
    }

    if (dosage >= substanceDosage.heavy) {
      classification = "heavy";
    }

    if (dosage > substanceDosage.overdose) {
      classification = "overdose";
    }

    return classification;
  }
}
