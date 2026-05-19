import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import React from 'react'

export default function CreateButton({ text, className, ...props }: any) {
    return (
        <Button
            {...props}
            className={cn("border border-primary rounded bg-transparent text-primary transition hover:text-white hover:bg-primary cursor-pointer", className)}
        >
            <Plus className="h-4 w-4" /> {text}
        </Button>
    )
}
