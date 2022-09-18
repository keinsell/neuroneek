import ms from "ms";
import { EffectOccurance } from "../../../../modules/effects/entities/effect-occurance.entity";
import { ChemicalNomenclature } from "../../../../modules/substance/entities/chemical-nomenclature";
import { ClassMembership } from "../../../../modules/substance/entities/class-membership.entity";
import { DosageClassification } from "../../../../modules/substance/entities/dosage.entity";
import { PsychoactiveClass } from "../../../../modules/substance/entities/psychoactive-class.enum";
import {
  RouteOfAdministration,
  RouteOfAdministrationType,
} from "../../../../modules/route-of-administration/entities/route-of-administration.entity";
import { Substance } from "../../../../modules/substance/entities/substance.entity";
import { AnalysisEnhancement } from "../../effects/cognitive/enhancements/analysis-enhancement.seed";
import { MotivationEnhancement } from "../../effects/cognitive/enhancements/motivation-enhancement.seed";
import { Stimulation } from "../../effects/physical/stimulation.seed";
import { MotivationSupression } from "../../effects/cognitive/supressions/motivation-suppression.seed";
import { PhaseType } from "../../../../modules/substance/entities/phase.entity";
import { FocusEnhancement } from "../../effects/cognitive/enhancements/focus.enhancement.seed";
import { Anxiety } from "../../effects/cognitive/enhancements/anxiety.seed";

export const Amphetamine: Substance = new Substance(
  {
    name: "Amphetamine",
    chemnicalNomencalture: new ChemicalNomenclature({
      commonNames: ["Amphetamine", "Speed", "Adderall", "Pep", "Fet"],
      substitutiveName: "α-Methylphenethylamine",
      systematicName: "(RS)-1-Phenylpropan-2-amine",
    }),
    classMembership: new ClassMembership({
      psychoactiveClass: PsychoactiveClass.stimulant,
      chemicalClass: "phenetylamine",
    }),
    administrationRoutes: [
      new RouteOfAdministration({
        route: RouteOfAdministrationType.insufflated,
        _substance: "Amphetamine",
        bioavailability: 0.8,
        dosage: {
          thereshold: 4,
          light: 6,
          moderate: 15,
          strong: 30,
          heavy: 50,
          overdose: 100,
        },
        duration: {
          onset: ms("5m"),
          comeup: ms("90m"),
          peak: ms("2h"),
          offset: ms("3h"),
          aftereffects: ms("4h"),
        },
      }),
    ],
    effects: [
      new EffectOccurance({
        effect: AnalysisEnhancement,
        substance: "Amphetamine",
        dosage: DosageClassification.light,
      }),
      new EffectOccurance({
        effect: AnalysisEnhancement,
        substance: "Amphetamine",
        dosage: DosageClassification.moderate,
      }),
      new EffectOccurance({
        effect: MotivationEnhancement,
        substance: "Amphetamine",
        dosage: DosageClassification.moderate,
      }),
      new EffectOccurance({
        effect: FocusEnhancement,
        substance: "Amphetamine",
        dosage: DosageClassification.light,
      }),
      new EffectOccurance({
        effect: FocusEnhancement,
        substance: "Amphetamine",
        dosage: DosageClassification.moderate,
      }),
      new EffectOccurance({
        effect: Stimulation,
        substance: "Amphetamine",
        dosage: DosageClassification.strong,
        intensivity: 2,
        description:
          "Amphetamine is reported to be very energetic and stimulating. It can encourage physical activities such as dancing, socializing, running, or cleaning. The particular style of stimulation that amphetamine produces can be described as forced. This means that at higher dosages, it becomes difficult or impossible to keep still. Jaw clenching, involuntary bodily shakes, and vibrations become present, resulting in extreme shaking of the entire body, unsteadiness of the hands, and a general loss of fine motor control. This is replaced with mild fatigue and general exhaustion during the offset of the experience.",
      }),
      new EffectOccurance({
        effect: MotivationSupression,
        substance: "Amphetamine",
        dosage: DosageClassification.moderate,
        intensivity: 3,
        description:
          "Experiences can range from mild demotivation to extreme states of disinterest. This effect is more prominent at common and heavy doses.",
        phase: PhaseType.aftereffects,
      }),
      new EffectOccurance({
        effect: Anxiety,
        substance: "Amphetamine",
        description:
          "Anxiety can reach severe levels during the comedown in some users.",
        phase: PhaseType.aftereffects,
      }),
    ],
  },
  "amphetamine"
);
