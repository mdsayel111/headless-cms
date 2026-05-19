import { cn } from "@/lib/utils";
import {
    TableBody,
    Table as TableComponent,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

export default function Table({ headers, children, wrapperClassName }: { headers: string[], children: any, wrapperClassName?: string }) {
    return (
        <div className={cn('border border-gray-200 rounded-b-none rounded-sm overflow-hidden', wrapperClassName)}>
            <TableComponent className="">
                <TableHeader className="border-b border-gray-200">
                    <TableRow>
                        {headers.map((h: string, i: number) => (
                            <TableHead
                                key={i}
                                className={`text-sm text-primary px-4 py-3 border-r font-semibold last:border-r-0 last:text-right last:w-30`}
                            >
                                <div className={cn(
                                    "flex items-center gap-1 select-none",
                                    h === "Actions" && "justify-end"
                                )}>
                                    {h}
                                </div>
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {children}
                </TableBody>
            </TableComponent>
        </div>
    )
}