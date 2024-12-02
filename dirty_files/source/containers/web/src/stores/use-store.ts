import type { Ingestion } from '@/types/ingestion'
import { listSubstances, type Substance } from '@/types/substance'
import { create, type StoreApi, type UseBoundStore } from 'zustand'

interface StoreState {
	ingestions: Ingestion[]
	substances: Substance[]
	addIngestion: (ingestion: Ingestion) => void
	deleteIngestionById: (ingestionId: string) => void
}

export const useStore: UseBoundStore<StoreApi<StoreState>> = create(
	(set): StoreState =>
		({
			ingestions: [],
			substances: listSubstances,
			addIngestion: (ingestion: Ingestion) => {
				set(state => ({
					ingestions: [...state.ingestions, ingestion]
				}))
			},
			deleteIngestionById: (ingestionId: string) => {
				set(state => ({
					ingestions: state.ingestions.filter(ingestion => ingestion.id !== ingestionId)
				}))
			}
		} as StoreState)
)
