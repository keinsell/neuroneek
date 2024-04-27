import '../../app/globals.css'
import Navbar from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { Toaster } from '@/components/ui/toaster'

export default function AppLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div key='1' className='grid min-h-screen w-full lg:grid-cols-[280px_1fr]'>
			<Sidebar />
			<div className='flex flex-col'>
				<Navbar />
				<main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6'>{children}</main>
				<Toaster />
			</div>
		</div>
	)
}
