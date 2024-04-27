import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { roaSeed } from '@/lib/store/roas-store';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/components/layouts/app-layout';
import { ChevronDownIcon, PillIcon } from 'lucide-react';
import { SUBSTANCES_MOCKUP } from '@/types/substance';
import { useEffect, useState } from 'react';

export default function createLogIngestionForm() {
  const [substance, setSubstance] = useState('');
  const [dosage, setDosage] = useState('');
  const [roa, setRoa] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // Load existing data from localStorage
    const savedData = localStorage.getItem('logEntries');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setSubstance(parsedData.substance || '');
      setDosage(parsedData.dosage || '');
      // ... similarly load other fields from parsedData
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Prepare the log entry data
    const logEntry = {
      substance,
      dosage,
      roa,
      date,
      time,
      notes,
    };

    console.log(logEntry);

    // Store in localStorage
    const existingEntries = localStorage.getItem('logEntries') || '[]'; // Array if entries exist
    const updatedEntries = JSON.stringify([...JSON.parse(existingEntries), logEntry]);
    localStorage.setItem('logEntries', updatedEntries);

    // Optionally clear the form fields
    setSubstance('');
    setDosage('');
    setRoa('');
    setDate('');
    setTime('');
    setNotes('');
  };


  return (
    <AppLayout>
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Log Ingestion</h1>
      </div>
      <div className="border shadow-sm rounded-lg p-6">
        <form className="grid gap-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="substance">Substance</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full flex items-center justify-between" variant="outline">
                    <span>{
                      SUBSTANCES_MOCKUP.find((sub) => `${sub.id}` === substance)?.name || 'Select a substance'
                    }</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full max-h-[300px] overflow-auto">
                  <div className="px-4 py-2">
                    <Input className="w-full" placeholder="Search substances..." />
                  </div>
                  <DropdownMenuSeparator />
                  {SUBSTANCES_MOCKUP.map((substance) => (
                    <DropdownMenuItem key={substance.id} itemID={`${substance.id}`}
                                      onClick={() => setSubstance(`${substance.id}`)}>{substance.name}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              <Label htmlFor="dosage">Dosage</Label>
              <Input id="dosage" placeholder="Enter dosage" type="number" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Route of Administration FormElement*/}
            <div>
              <Label htmlFor="roa">Route of Administration</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full flex items-center justify-between" variant="outline">
                    <span>Select a route</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {roaSeed.map((roa) => (
                    <DropdownMenuItem key={roa.id} itemID={roa.id}>{roa.name}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              <Label htmlFor="date">Date Administered</Label>
              <Input id="date" type="date" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="time">Time Administered</Label>
              <Input id="time" type="time" />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Enter any additional notes" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PillIcon className="h-6 w-6 text-gray-500" />
              <span className="text-sm font-medium text-gray-500">Dosage Strength: 100 μg</span>
            </div>
            <Button className="ml-auto" type="submit">
              Log Ingestion
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
