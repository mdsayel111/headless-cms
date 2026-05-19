"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { FieldLabel } from "./field"

export function DatePickerDemo({ label, required }: any) {
    const [date, setDate] = React.useState<Date>()

    return (
        <div>
            {label && (
                <FieldLabel className="mb-2 uppercase">
                    {label}
                    {required && (
                        <span className="text-red-500">*</span>
                    )}
                </FieldLabel>
            )}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        data-empty={!date}
                        className="justify-start w-full text-left font-normal data-[empty=true]:text-muted-foreground h-11 data-[state=open]:border-primary"
                    >
                        <CalendarIcon />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} />
                </PopoverContent>
            </Popover>
        </div>
    )
}