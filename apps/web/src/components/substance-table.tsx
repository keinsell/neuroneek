import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { type Substance } from '@/types/substance'
import React from 'react'

interface SubstanceTableProperties {
	substances: Substance[]
	isLoading: boolean
}

export default function SubstanceTable({ substances, isLoading }: SubstanceTableProperties) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Substance</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{isLoading
					? Array(10)
							.fill(0)
							.map((_, index) => (
								<TableRow key={index}>
									<TableCell>
										<Skeleton className='h-4 w-[150px]' />
									</TableCell>
								</TableRow>
							))
					: substances.map(substance => (
							<TableRow key={substance.id}>
								<TableCell className='font-medium'>{substance.name}</TableCell>
							</TableRow>
					  ))}
			</TableBody>
		</Table>
	)
}
