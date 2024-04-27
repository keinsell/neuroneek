import AppLayout from '@/components/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import '../app/globals.css'
import { useToast } from '@/components/ui/use-toast'
import { listIngestions } from '@/types/ingestion'
import Link from 'next/link'

export default function IngestionPage() {
	const { toast } = useToast()

	return (
		<AppLayout>
			<div className='flex items-center'>
				<h1 className='font-semibold text-lg md:text-2xl'>Ingestion History</h1>
				<Link href={'/ingestion/create'}>
					<Button className='ml-auto' size='sm'>
						Log Ingestion
					</Button>
				</Link>
			</div>
			<div className='border shadow-sm rounded-lg'>
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
						{listIngestions.map(ingestion => (
							<TableRow key={ingestion.id}>
								<TableCell className='font-medium'>{'TODO'}</TableCell>
								<TableCell>{ingestion.dosage_amount + ' ' + ingestion.dosage_unit}</TableCell>
								<TableCell>{ingestion.routeOfAdministration}</TableCell>
								<TableCell>{ingestion.id}</TableCell>
								<TableCell>10:30 PM</TableCell>
								<TableCell>
									<Button size='sm' variant='outline'>
										Edit
									</Button>
									<Button
										className='ml-2'
										size='sm'
										variant='outline'
										onClick={() => {
											toast({
												title: 'Ingestion deleted',
												description: 'Ingestion was deleted successfully'
											})
										}}>
										Delete
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</AppLayout>
	)
}
