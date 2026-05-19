import Modal from '@/components/shared/modal/modal';
import ActionDropdown from '@/components/shared/table/action-dropdown';
import CreateButton from '@/components/shared/table/create-button';
import NoItem from '@/components/shared/table/no-item';
import { Pagination } from '@/components/shared/table/pagination';
import Table from '@/components/shared/table/table';
import SearchBox from '@/components/ui/search-box';
import { TableCell, TableRow } from '@/components/ui/table';
import { Head } from '@inertiajs/react';
import { Eye, PenTool, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard({ data }: { data: any }) {
    const [search, setSearch] = useState('');
    const [projectModalOpen, setProjectModalOpen] = useState(false);

    return (
        <>
            <Head title="Projects" />
            <div className="p-4 flex flex-col md:flex-row gap-6 lg:gap-4 lg:items-center justify-end rounded-t-sm border border-default border-b-0 overflow-hidden">
                <SearchBox
                    containerClassName="mx-auto lg:ml-auto lg:mr-0"
                    value={search}
                    onChange={setSearch}
                />
                <CreateButton text="Create Project" onClick={() => setProjectModalOpen(true)} />
            </div>
            <Table
                headers={['#', 'Name', 'description', 'Total table', 'Actions']}
                wrapperClassName="rounded-t-none"
            >
                {data?.data?.length > 0 ? (
                    data?.data?.map((item: any) => (
                        <TableRow key={item?.id} className="cursor-pointer">

                            <TableCell className="px-4 py-3 border-r">
                                {item?.id}
                            </TableCell>

                            <TableCell className="px-4 py-3 border-r">
                                {item?.name}
                            </TableCell>
                            <TableCell className="px-4 py-3 border-r">
                                {item?.description}
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
                                            color: "text-yellow-500 hover:text-yellow-500!",
                                            Icon: Plus
                                        },
                                        {
                                            label: "View Tables",
                                            onClick: () => {
                                                // setId(item.id);
                                                // setEditModalOpen(true);
                                            },
                                            color: "text-blue-500 hover:text-blue-500!",
                                            Icon: Eye
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
                    <NoItem />
                )}
            </Table>
            <Pagination
                className="mt-4"
                page={0}
                totalPages={0}
                setPage={() => { }}
            />


            {/* modals */}
            <Modal
                isOpen={projectModalOpen}
                setIsOpen={setProjectModalOpen}
                icon={<img
                    src="/icons/project.png"
                    className="w-16"
                />}
            >
                ok
            </Modal>
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
