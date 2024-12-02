import AppLayout from '@/components/layouts/app-layout'
import SubstanceTable from '@/components/substance-table'
import { useToast } from '@/components/ui/use-toast'
import ms from 'ms'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'

export default function SubstancesPage() {
	const fetcher = (url: string) => fetch(url).then(res => res.json())

	interface ISubstanceResponse {
		id: string
		name: string
		common_names: string[]
		psychoactive_classes: string[]
		chemical_classes: string[]
	}

	const { toast } = useToast()

	const {
		data: substances,
		isLoading,
		error,
		isValidating,
		mutate
	} = useSWR<ISubstanceResponse[]>('https://neuronek.up.railway.app/substance', fetcher)

	const [fetchStartTime, setFetchStartTime] = useState<number | null>(null)

	useEffect(() => {
		if (isValidating && fetchStartTime === null) {
			setFetchStartTime(Date.now())
		}

		if (!isValidating && fetchStartTime !== null) {
			const fetchTime = Date.now() - fetchStartTime
			toast({
				title: 'Fetch completed',
				description: `Fetched ${substances?.length} substances in ${fetchTime}ms`,
				duration: ms('1s')
			})
			setFetchStartTime(null)
		}
	}, [isValidating, fetchStartTime, substances, toast])

	useEffect(() => {
		if (error) {
			toast({
				title: 'Error',
				description: error.message,
				duration: ms('1s')
			})
		}

		if (isLoading) {
			toast({
				title: 'Loading...',
				duration: ms('1s')
			})
		}
	}, [error, isLoading, toast])

	if (error) {
		toast({
			title: 'Experienced error fetching substances',
			description: error.message,
			duration: ms('1s')
		})

		return <div>failed to load</div>
	}

	return (
		<AppLayout>
			<div className='flex items-center'>
				<h1 className='font-semibold text-lg md:text-2xl'>Substances</h1>
			</div>
			<div className='border shadow-sm rounded-lg'>
				<SubstanceTable isLoading={isLoading} substances={(substances as any) ?? []} />
			</div>
		</AppLayout>
	)
}
