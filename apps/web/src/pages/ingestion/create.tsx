import AppLayout from '@/components/layouts/app-layout'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { FormMessageV2 } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { AddIngestionCommand } from '@/lib/actions/add-ingestion'
import { RouteOfAdministrationClassification } from '@/types/route-of-administration'
import { listSubstances } from '@/types/substance'
import { getValue, setValue, SubmitHandler, useForm } from '@modular-forms/react'
import { ChevronDownIcon, PillIcon } from 'lucide-react'

type CreateIngestionForm = AddIngestionCommand

export default function CreateIngestionPage() {
	const [addIngestionForm, { Form, Field }] = useForm<CreateIngestionForm>()
	const { toast } = useToast()

	const ingestionSubmitHandler: SubmitHandler<CreateIngestionForm> = (values, event) => {
		event.preventDefault()
		toast({
			title: '🎉 Ingestion Logged',
			description: (
				<div className='flex flex-col gap-2'>
					<div>
						<p className='text-gray-500'>You have successfully logged an ingestion.</p>
						<p className='text-gray-500'>You can view the ingestion below.</p>
					</div>
					<pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
						<code className='text-white'>{JSON.stringify(values, null, 2)}</code>
					</pre>
				</div>
			)
		})
	}

	return (
		<AppLayout>
			<div className='flex items-center'>
				<h1 className='font-semibold text-lg md:text-2xl'>Log Ingestion</h1>
			</div>
			<div className='border shadow-sm rounded-lg p-6'>
				<Form className='grid gap-6' onSubmit={ingestionSubmitHandler}>
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<Field name='substanceId' type='string'>
								{(field, props) => (
									<>
										<Label htmlFor='substance'>Substance</Label>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button className='w-full flex items-center justify-between' variant='outline'>
													<span>
														{getValue(addIngestionForm, 'substanceId')
															? listSubstances.find(
																	substance => `${substance.id}` === getValue(addIngestionForm, 'substanceId')
															  )?.name
															: 'Search for a substance'}
													</span>
													<ChevronDownIcon className='h-4 w-4' />
												</Button>
											</DropdownMenuTrigger>
											{field.error && <FormMessageV2>{field.error}</FormMessageV2>}
											<DropdownMenuContent className='w-full max-h-[300px] overflow-auto'>
												<div className='px-4 py-2'>
													<Input className='w-full' placeholder='Select a substance...' />
												</div>
												<DropdownMenuSeparator />
												{listSubstances.map(substance => (
													<DropdownMenuItem
														key={substance.id}
														itemID={`${substance.id}`}
														onClick={() => setValue(addIngestionForm, 'substanceId', `${substance.id}`)}>
														{substance.name}
													</DropdownMenuItem>
												))}
											</DropdownMenuContent>
										</DropdownMenu>
									</>
								)}
							</Field>
						</div>
						<div>
							<Field name='dosage.amount' type='number'>
								{(field, props) => (
									<>
										<Label htmlFor='dosage'>Dosage</Label>
										<Input
											id='dosage'
											placeholder='Enter dosage'
											type='number'
											onChange={e => setValue(addIngestionForm, 'dosage.amount', parseInt(e.target.value))}
										/>
										{field.error && <FormMessageV2>{field.error}</FormMessageV2>}
									</>
								)}
							</Field>
						</div>
					</div>
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<Field name='routeOfAdministration' type='string'>
								{(field, props) => (
									<>
										<Label htmlFor='roa'>Route of Administration</Label>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button className='w-full flex items-center justify-between' variant='outline'>
													<span>{getValue(addIngestionForm, 'routeOfAdministration') ?? 'Select a route'}</span>
													<ChevronDownIcon className='h-4 w-4' />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent className='w-full'>
												{Object.values(RouteOfAdministrationClassification).map(roa => (
													<DropdownMenuItem
														key={roa}
														itemID={roa}
														onClick={() => setValue(addIngestionForm, 'routeOfAdministration', roa)}>
														{roa}
													</DropdownMenuItem>
												))}
											</DropdownMenuContent>
										</DropdownMenu>
									</>
								)}
							</Field>
						</div>
						<div>
							<Field name='ingestedAt' type='Date'>
								{(field, props) => (
									<>
										<Label htmlFor='date'>Date Administered</Label>
										<Input {...props} id='date' type='date' />
									</>
								)}
							</Field>
						</div>
					</div>
					<div className='grid grid-cols-2 gap-4'>
						<Field name='ingestedAt' type='Date'>
							{(field, props) => (
								<>
									<Label htmlFor='time'>Time Administered</Label>
									<Input
										id='time'
										type='time'
										// On change get ingestAt value
										// (or set it to current time) and set hour and minute of the day to this date.
										// Then set the value to the form.
										onChange={e => {
											const date = new Date(getValue(addIngestionForm, 'ingestedAt') ?? new Date())
											const hour = date.getHours()
											const minute = date.getMinutes()
											setValue(addIngestionForm, 'ingestedAt', new Date(date.setHours(hour, minute)))
										}}
									/>
								</>
							)}
						</Field>
						<div>
							<Label htmlFor='notes'>Notes</Label>
							<Textarea id='notes' placeholder='Enter any additional notes' />
						</div>
					</div>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<PillIcon className='h-6 w-6 text-gray-500' />
							<span className='text-sm font-medium text-gray-500'>Dosage Strength: 100 μg</span>
						</div>
						<Button className='ml-auto' type='submit'>
							Log Ingestion
						</Button>
					</div>
				</Form>
			</div>
		</AppLayout>
	)
}
