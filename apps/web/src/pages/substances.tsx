import AppLayout from '@/components/layouts/app-layout'
import SubstanceTable from '@/components/substance-table'
import { listSubstances } from '@/types/substance'

export default function SubstancesPage() {
	// TODO: Fetch Substances from API
	// Ingerface below will be satisfied by the API response
	interface ISubstanceResponse {
		id: string
		name: string
		common_names: string[]
		psychoactive_classes: string[]
		chemical_classes: string[]
	}

	return (
		<AppLayout>
			<div className='flex items-center'>
				<h1 className='font-semibold text-lg md:text-2xl'>Substances</h1>
			</div>
			<div className='border shadow-sm rounded-lg'>
				<SubstanceTable substances={listSubstances} />
			</div>
		</AppLayout>
	)
}
