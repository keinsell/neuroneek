import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useStore } from '@/stores/use-store'
import { type Substance } from '@/types/substance'
import React from 'react'

interface SubstanceTableProperties {
	substances: Substance[]
}

export default function SubstanceTable({ substances }: SubstanceTableProperties) {
	useStore.setState({ substances })
	const { substances: substanceState } = useStore()
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Substance</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{substanceState.map(substance => (
					<TableRow key={substance.id}>
						<TableCell className='font-medium'>{substance.name}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
