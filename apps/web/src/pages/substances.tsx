import AppLayout from '@/components/layouts/app-layout'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { listSubstances } from '@/types/substance'

export default function SubstancesPage() {
	return (
		<AppLayout>
			<div className='flex items-center'>
				<h1 className='font-semibold text-lg md:text-2xl'>Substances</h1>
			</div>
			<div className='border shadow-sm rounded-lg'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Substance</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{listSubstances.map(substance => (
							<TableRow key={substance.id}>
								<TableCell className='font-medium'>{substance.name}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</AppLayout>
	)
}
