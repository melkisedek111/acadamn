"use client";
import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export type TCustomSelectDropdownData = {
    title: string;
    value: string;
}

type TCustomSelectDropdownProps = {
    data: TCustomSelectDropdownData[]
    placeholder?: string;
    className?: string;
    title?: string;
    selectedData: string;
    setSelectedData: React.Dispatch<React.SetStateAction<string>>
}

export function CustomSelectDropdown({ data, placeholder, className, title, selectedData, setSelectedData }: TCustomSelectDropdownProps) {
    return (
        <Select defaultValue={selectedData} onValueChange={(e => setSelectedData(e))}>
            <SelectTrigger className={className || "w-[180px]"}>
                <SelectValue placeholder={placeholder || "Please select an item."} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{title || "Items"}</SelectLabel>
                    {
                        data.map(item => (
                            <SelectItem value={item.value}>{item.title}</SelectItem>

                        ))
                    }
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
