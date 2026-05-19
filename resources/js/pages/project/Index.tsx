import ActionDropdown from '@/components/shared/table/action-dropdown';
import CreateButton from '@/components/shared/table/create-button';
import NoItem from '@/components/shared/table/no-item';
import { Pagination } from '@/components/shared/table/pagination';
import Table from '@/components/shared/table/table';
import SearchBox from '@/components/ui/search-box';
import { TableCell, TableRow } from '@/components/ui/table';
import { Head } from '@inertiajs/react';
import { PenTool, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard({ data }: { data: any }) {
    const [search, setSearch] = useState('');

    return (
        <>
            <Head title="Projects" />
            <div className="p-4 flex flex-col md:flex-row gap-6 lg:gap-4 lg:items-center justify-end rounded-t-sm border border-default border-b-0 overflow-hidden">
                <SearchBox
                    containerClassName="mx-auto lg:ml-auto lg:mr-0"
                    value={search}
                    onChange={setSearch}
                />
                <CreateButton text="Create Project" />
            </div>
            <Table
                headers={['#', 'Name', 'Total Fields', 'Actions']}
                wrapperClassName="rounded-t-none"
            >
                {data?.data?.length > 0 ? (
                    data?.data?.map((item: any) => (
                        <TableRow key={item?.id} className="cursor-pointer">

                            <TableCell className="px-4 py-3 border-r">
                                {item?.id}
                            </TableCell>

                            <TableCell className="px-4 py-3 border-r">
                                {item?.table_name}
                            </TableCell>

                            <TableCell className="px-4 py-3 border-r">
                                {item?.fields?.length}
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
                                            label: "Add Table",
                                            onClick: () => {
                                                // setId(item.id);
                                                // setEditModalOpen(true);
                                            },
                                            color: "text-green-500 hover:text-green-500!",
                                            Icon: PenTool
                                        },
                                        {
                                            label: "View Tables",
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
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Projects'
        },
    ],
};
