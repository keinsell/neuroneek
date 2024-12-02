import { nanoid } from 'nanoid'
import type { Opaque } from 'type-fest'

export type SubstanceId = Opaque<string, 'substance.id'>

export interface Substance {
	id: SubstanceId
	name: string
	description: string
	createdAt: string
	updatedAt: string
	version: number
}

export const listSubstances = [
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
