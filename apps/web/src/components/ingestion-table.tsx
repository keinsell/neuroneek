import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import '../app/globals.css'
import { type Ingestion, type IngestionId } from '@/types/ingestion'
import Link from 'next/link'

export interface IngestionTableProperties {
	ingestions: Ingestion[]
	editIngestion: (ingestion: IngestionId) => void
	deleteIngestion: (ingestion: IngestionId) => void
}

export default function IngestionTable({ ingestions, editIngestion, deleteIngestion }: IngestionTableProperties) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Substance</TableHead>
					<TableHead>Dosage</TableHead>
					<TableHead>Route</TableHead>
					<TableHead>Date</TableHead>
					<TableHead>Time</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{ingestions.map(ingestion => (
					<TableRow key={ingestion.id}>
						<TableCell className='font-medium'>{'TODO'}</TableCell>
						<TableCell>{ingestion.dosage_amount + ' ' + ingestion.dosage_unit}</TableCell>
						<TableCell>{ingestion.routeOfAdministration}</TableCell>
						<TableCell>{ingestion.id}</TableCell>
						<TableCell>10:30 PM</TableCell>
						<TableCell>
							<Link href={`/ingestion/${ingestion.id}`}>
								<Button size='sm' variant='outline' onClick={() => editIngestion(ingestion.id)}>
									Edit
								</Button>
							</Link>
							<Button className='ml-2' size='sm' variant='outline' onClick={() => deleteIngestion(ingestion.id)}>
								Delete
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
