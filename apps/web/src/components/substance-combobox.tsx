import React, { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Combobox } from '@/components/combobox'

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
		<Combobox
			mode='single' //single or multiple
			options={[]}
			placeholder='Select option...'
			selected={""} // string or array
			onChange={(value) => console.log(value)}
		/>
	);
}
