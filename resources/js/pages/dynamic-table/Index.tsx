import { PenTool, Trash2 } from "lucide-react";
import ActionDropdown from "@/components/shared/table/action-dropdown";
import NoItem from "@/components/shared/table/no-item";
import { Pagination } from "@/components/shared/table/pagination";
import Table from "@/components/shared/table/table";
import { TableCell, TableRow } from "@/components/ui/table";

export default function DynamicTables({ data }: { data: any }) {
    return (
        <>
            <Table
                headers={['#', 'Name', 'Total Fields', 'Actions']}
            >
                {data?.data?.length > 0 ? (
                    data?.data?.map((item: any) => (
                        <TableRow key={item.id} className="cursor-pointer">

                            <TableCell className="px-4 py-3 border-r">
                                {item?.id}
                            </TableCell>

                            <TableCell className="px-4 py-3 border-r">
                                {item.table_name}
                            </TableCell>

                            <TableCell className="px-4 py-3 border-r">
                                {item.fields.length}
                            </TableCell>

                            <TableCell className="px-4 py-3 text-right">
                                <ActionDropdown
                                    actions={[
                                        {
                                            label: "Edit",
                                            onClick: () => {
                                                // setId(item.id);
                                                // setEditModalOpen(true);
                                            },
                                            color: "text-green-500 hover:text-green-500!",
                                            Icon: PenTool
                                        },
                                        {
                                            label: "Delete",
                                            onClick: () => { },
                                            color: "text-red-500 hover:text-red-500!",
                                            Icon: Trash2
                                        },
                                    ]}
                                />
                            </TableCell>

                        </TableRow>
                    ))
                ) : (
                    <NoItem colSpan={6} />
                )}
            </Table>
            <Pagination
                className="mt-4"
                page={0}
                totalPages={0}
                setPage={() => { }}
            />
        </>
    )
}
