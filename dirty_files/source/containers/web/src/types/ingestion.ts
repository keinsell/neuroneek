import { RouteOfAdministrationClassification } from '@neuronek/osiris'
import type { SubstanceId } from '@/types/substance'
import { nanoid } from 'nanoid'
import type { Opaque } from 'type-fest'
import { date, enum_, number, object, Output, string } from 'valibot'

export type IngestionId = Opaque<string, 'ingestion.id'>

export interface Ingestion {
	id: IngestionId
	substanceId: SubstanceId
	routeOfAdministration: RouteOfAdministrationClassification
	ingestionNotes?: string
	dosage_amount: number
	dosage_unit: string
}

export const AddIngestionCommand = object({
	substanceId: string([]),
	routeOfAdministration: enum_(RouteOfAdministrationClassification),
	dosage: object({
		amount: number(),
		unit: string()
	}),
	ingestedAt: date()
})

export type AddIngestionCommand = Output<typeof AddIngestionCommand>

export const listIngestions = [
	{
		id: nanoid() as IngestionId,
		substanceId: nanoid() as SubstanceId,
		routeOfAdministration: RouteOfAdministrationClassification.sublingual,
		ingestionNotes: '',
		dosage_amount: 300,
		dosage_unit: 'ug',
		ingestedAt: new Date()
	}
]
