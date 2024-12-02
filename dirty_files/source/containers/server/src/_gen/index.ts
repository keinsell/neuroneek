import {Account as _Account}                                               from './account.js';
import {AccountRelations as _AccountRelations}                             from './account_relations.js';
import {Dosage as _Dosage}                                                 from './dosage.js';
import {DosageRelations as _DosageRelations}                               from './dosage_relations.js';
import {Effect as _Effect}                                                 from './effect.js';
import {EffectRelations as _EffectRelations}                               from './effect_relations.js';
import {Ingestion as _Ingestion}                                           from './ingestion.js';
import {IngestionRelations as _IngestionRelations}                         from './ingestion_relations.js';
import {Phase as _Phase}                                                   from './phase.js';
import {PhaseRelations as _PhaseRelations}                                 from './phase_relations.js';
import {RouteOfAdministration as _RouteOfAdministration}                   from './route_of_administration.js';
import {RouteOfAdministrationRelations as _RouteOfAdministrationRelations} from './route_of_administration_relations.js';
import {Stash as _Stash}                                                   from './stash.js';
import {StashRelations as _StashRelations}                                 from './stash_relations.js';
import {Subject as _Subject}                                               from './subject.js';
import {SubjectRelations as _SubjectRelations}                             from './subject_relations.js';
import {Substance as _Substance}                                           from './substance.js';
import {SubstanceInteraction as _SubstanceInteraction}                     from './substance_interaction.js';
import {SubstanceInteractionRelations as _SubstanceInteractionRelations}   from './substance_interaction_relations.js';
import {SubstanceRelations as _SubstanceRelations}                         from './substance_relations.js';



export namespace PrismaModel {
	export class AccountRelations extends _AccountRelations {}


	export class SubjectRelations extends _SubjectRelations {}


	export class SubstanceRelations extends _SubstanceRelations {}


	export class RouteOfAdministrationRelations extends _RouteOfAdministrationRelations {}


	export class PhaseRelations extends _PhaseRelations {}


	export class DosageRelations extends _DosageRelations {}


	export class EffectRelations extends _EffectRelations {}


	export class IngestionRelations extends _IngestionRelations {}


	export class StashRelations extends _StashRelations {}


	export class SubstanceInteractionRelations extends _SubstanceInteractionRelations {}


	export class Account extends _Account {}


	export class Subject extends _Subject {}


	export class Substance extends _Substance {}


	export class RouteOfAdministration extends _RouteOfAdministration {}


	export class Phase extends _Phase {}


	export class Dosage extends _Dosage {}


	export class Effect extends _Effect {}


	export class Ingestion extends _Ingestion {}


	export class Stash extends _Stash {}


	export class SubstanceInteraction extends _SubstanceInteraction {}


	export const extraModels = [
		AccountRelations, SubjectRelations, SubstanceRelations, RouteOfAdministrationRelations, PhaseRelations,
		DosageRelations, EffectRelations, IngestionRelations, StashRelations, SubstanceInteractionRelations, Account,
		Subject, Substance, RouteOfAdministration, Phase, Dosage, Effect, Ingestion, Stash, SubstanceInteraction,
	];
}
