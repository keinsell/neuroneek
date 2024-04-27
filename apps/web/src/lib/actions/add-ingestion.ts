// This aciton will save the ingestion to local state, then local storage and
// in a free time request will be sent to the server to save the ingestion.

import { useIngestionStore } from '@/lib/store/ingestion-store'
import { RouteOfAdministrationClassification } from '@/types/route-of-administration'
import { enum_, number, object, Output, string } from 'valibot'

export const AddIngestionCommand = object({
	substanceId: string([]),
	routeOfAdministration: enum_(RouteOfAdministrationClassification),
	dosage: object({
		amount: number()
		// unit: string()
	})
	// ingestedAt: date()
})

export type AddIngestionCommand = Output<typeof AddIngestionCommand>

export const addIngestion = (ingestion: AddIngestionCommand) => {
	console.log(ingestion)

	// Fetch all ingestion's from the store
	const currentIngestion = useIngestionStore.getState().ingestions

	// Add the new ingestion to the store
	useIngestionStore.getState().addIngestion({
		id: '',
		substanceId: ingestion.substanceId,
		routeOfAdministration: ingestion.routeOfAdministration,
		dosage: ingestion.dosage
		// ingestedAt: ingestion.ingestedAt
	} as any)

	// Save the ingestions to local storage
	localStorage.setItem('ingestions', JSON.stringify(currentIngestion))
}
