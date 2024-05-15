"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { UseFormReturn } from "react-hook-form"

const frameworks = [
    {
        value: "next.js",
        label: "Next.js",
    },
    {
        value: "sveltekit",
        label: "SvelteKit",
    },
    {
        value: "nuxt.js",
        label: "Nuxt.js",
    },
    {
        value: "remix",
        label: "Remix",
    },
    {
        value: "astro",
        label: "Astro",
    },
]

export type TCustomComboboxData = {
    id?: number;
    label: string;
    value: string;
}

type TCustomCombobox = {
    data: TCustomComboboxData[]
    placeholder?: string;
    className?: string;
    title?: string;
    selectedData: string;
    form: any,
    name: string;
}

export function CustomCombobox({data, placeholder, className, title, selectedData, form, name }: TCustomCombobox) {

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                        "justify-between",
                        !selectedData && "text-muted-foreground"
                      )}
                >
                    {selectedData
                        ? data.find((item) => item.value === selectedData)?.label
                        : placeholder || "Select item..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder={placeholder || "Search item..."} className="h-9" />
                    <CommandEmpty>No {title || "Item"} found.</CommandEmpty>
                    <CommandList >
                        {data.map((item) => (
                            <CommandItem
                                key={item.value}
                                value={item.value}
                                onSelect={(currentValue) => {
                                    form.setValue(name, item.value)
                                }}
                            >
                                {item.label}
                                <CheckIcon
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        selectedData === item.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
