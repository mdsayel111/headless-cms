import { TableCell, TableRow } from '@/components/ui/table'

export default function NoItem({ colSpan = 1000000 }: { colSpan?: number }) {
    return (
        <TableRow>
            <TableCell colSpan={colSpan} className="h-24 text-center text-gray-500">
                No items found
            </TableCell>
        </TableRow>
    )
}
