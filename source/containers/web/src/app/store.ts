import type { Ingestion, IngestionId } from '@/types/ingestion'
import type { Substance, SubstanceId } from '@/types/substance'
import { nanoid } from 'nanoid'

import { createStore } from 'zustand/vanilla'

export type CounterState = {
	ingestions: Ingestion[]
	substances: Substance[]
}

export type CounterActions = {
	createIngestion: (ingestion: Ingestion) => void
	deleteIngestion: (ingestionId: IngestionId) => void
	listIngestion: () => Ingestion[]
	getSubstanceNameById: (substanceId: SubstanceId) => string | undefined
	listSubstances: () => Substance[]
}

export type CounterStore = CounterState & CounterActions

export const defaultInitState: CounterState = {
	ingestions: [],
	substances: [
		{
			id: nanoid() as SubstanceId,
			name: 'LSD',
			description: 'Lysergic acid diethylamide',
			createdAt: '2023-04-15T00:00:00.000',
			updatedAt: '2023-04-15T00:00:00.000',
			version: 1
		},
		{
			id: nanoid() as SubstanceId,
			name: 'Psilocybin',
			description: 'Psilocybin',
			createdAt: '2023-04-15T00:00:00.000',
			updatedAt: '2023-04-15T00:00:00.000',
			version: 1
		}
	]
}

export const createCounterStore = (initState: CounterState = defaultInitState) => {
	return createStore<CounterStore>()((set, get) => ({
		...initState,
		createIngestion: (ingestion: Ingestion) => {
			set(state => ({
				ingestions: [...state.ingestions, ingestion]
			}))
		},
		deleteIngestion: (ingestionId: IngestionId) => {
			set(state => ({
				ingestions: state.ingestions.filter(ingestion => ingestion.id !== ingestionId)
			}))
		},
		listIngestion: () => get().ingestions as any,
		getSubstanceNameById: (substanceId: SubstanceId) => {
			return get().substances.find(s => s.id === substanceId)?.name
		},
		listSubstances: () => get().substances as Substance[]
	}))
}
