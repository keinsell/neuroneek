// This aciton will save the ingestion to local state, then local storage and
// in a free time request will be sent to the server to save the ingestion.

import { RouteOfAdministrationClassification } from '@neuronek/osiris'
import { date, enum_, number, object, Output, string } from 'valibot'

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
