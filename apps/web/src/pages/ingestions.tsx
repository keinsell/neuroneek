import IngestionTable from '@/components/ingestion-table'
import AppLayout from '@/components/layouts/app-layout'
import { Button } from '@/components/ui/button'
import '../app/globals.css'
import { useStore } from '@/stores/use-store'
import Link from 'next/link'

export default function IngestionPage() {
	// useStore.setState({ ingestions: [] })
	const { ingestions: ingestionState, deleteIngestionById } = useStore()

	return (
		<AppLayout>
			<div className='flex items-center'>
				<h1 className='font-semibold text-lg md:text-2xl'>Ingestion History</h1>
				<Link href={'/ingestion/create'}>
					<Button className='ml-auto sm'>
						Log Ingestion
					</Button>
				</Link>
			</div>
			<div className='border shadow-sm rounded-lg'>
				<IngestionTable
					ingestions={ingestionState}
					deleteIngestion={deleteIngestionById}
					editIngestion={() => {}}></IngestionTable>
			</div>
		</AppLayout>
	)
}
