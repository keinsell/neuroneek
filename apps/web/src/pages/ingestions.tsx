import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import '../app/globals.css';
import AppLayout from '@/components/layouts/app-layout';


export default function IngestionPage() {
  const ingestions = [{
    id: 1,
    date: '2023-04-15',
    status: 'PENDING',
    substance: 'LSD',
    dosage: '100 mg',
    route: 'Oral',
    routeOfAdministration: 'Substance',
    isEstimatedDosage: false,
    notes: '',
    user: 'Raul_Marks',
    createdAt: '2023-04-15T00:00:00.000Z',
    updatedAt: '2023-04-15T00:00:00.000Z',
    version: 1,
  }];

  return (
    <AppLayout>
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Ingestion History</h1>
        <Link href={'/ingestion/create'}>
          <Button className="ml-auto" size="sm">
            Log Ingestion
          </Button>
        </Link>
      </div>
      <div className="border shadow-sm rounded-lg">
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
            {ingestions.map((ingestion) => (
              <TableRow key={ingestion.id}>
                <TableCell className="font-medium">{ingestion.substance}</TableCell>
                <TableCell>{ingestion.dosage}</TableCell>
                <TableCell>{ingestion.route}</TableCell>
                <TableCell>{ingestion.date}</TableCell>
                <TableCell>10:30 PM</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button className="ml-2" size="sm" variant="outline">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
