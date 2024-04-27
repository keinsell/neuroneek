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
import { getValue, setValue, SubmitHandler, useForm } from '@modular-forms/react';
import { addIngestion, AddIngestionCommand } from '@/lib/actions/add-ingestion';
import { useToast } from '@/components/ui/use-toast';

type CreateIngestionForm = AddIngestionCommand

export default function CreateIngestionPage() {
  const [addIngestionForm, { Form, Field }] = useForm<CreateIngestionForm>();
  const { toast } = useToast();


  const ingestionSubmitHandler: SubmitHandler<CreateIngestionForm> = (values, event) => {
    event.preventDefault();
    addIngestion(values);


    toast({
      title: 'Ingestion logged successfully',
      description: 'The ingestion has been logged successfully.',
      type: 'foreground',
    });
  };

  return (
    <AppLayout>
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Log Ingestion</h1>
      </div>
      <div className="border shadow-sm rounded-lg p-6">
        <Form className="grid gap-6" onSubmit={ingestionSubmitHandler}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="substance">Substance</Label>
              <Field name="substanceId" type="string">
                {(field, props) => <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full flex items-center justify-between" variant="outline">
                      <span> {
                        getValue(addIngestionForm, 'substanceId') ? (SUBSTANCES_MOCKUP.find((substance) => `${substance.id}` === getValue(addIngestionForm, 'substanceId')))?.name : 'Search for a substance'
                      }</span>
                      <ChevronDownIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full max-h-[300px] overflow-auto">
                    <div className="px-4 py-2">
                      <Input className="w-full" placeholder="Select a substance..." />
                    </div>
                    <DropdownMenuSeparator />
                    {SUBSTANCES_MOCKUP.map((substance) => (
                      <DropdownMenuItem key={substance.id} itemID={`${substance.id}`}
                                        onClick={() => setValue(addIngestionForm, 'substanceId', `${substance.id}`)}>{substance.name}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>}
              </Field>
            </div>
            <Field name="dosage.amount" type="number">
              {(field, props) => <>
                <Label htmlFor="dosage">Dosage</Label>
                <Input id="dosage" placeholder="Enter dosage" type="number"
                       onChange={(e) => setValue(addIngestionForm, 'dosage.amount', parseInt(e.target.value))} />
              </>}
            </Field>
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
        </Form>
      </div>
    </AppLayout>
  );
}
