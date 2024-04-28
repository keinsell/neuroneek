import { LandingPage } from '@/components/landing-page';
import '../app/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home({
                               children,
                             }: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={inter.className}>
      <LandingPage />
    </div>
  );
}
