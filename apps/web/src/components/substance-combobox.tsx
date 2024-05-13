import React, { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function SubstanceCombobox() {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");

	const frameworks = [
		{ value: "next.js", label: "Next.js" },
		{ value: "sveltekit", label: "SvelteKit" },
		{ value: "nuxt.js", label: "Nuxt.js" },
		{ value: "remix", label: "Remix" },
		{ value: "astro", label: "Astro" },
	];

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{value ? frameworks.find(f => f.value === value)?.label : "Select framework..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command value={value} onValueChange={setValue}>
					<CommandInput placeholder="Search framework..." />
					<CommandEmpty>No framework found.</CommandEmpty>
					{frameworks.map(framework => (
						<CommandItem key={framework.value} value={framework.value}>
							<Check
								className={cn(
									"mr-2 h-4 w-4",
									value === framework.value ? "opacity-100" : "opacity-0"
								)}
							/>
							{framework.label}
						</CommandItem>
					))}
				</Command>
			</PopoverContent>
		</Popover>
	);
}
