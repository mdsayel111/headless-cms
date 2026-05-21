import ProjectModalContents from '@/components/project/project-modal-contents';
import Modal from '@/components/shared/modal/modal';
import ActionDropdown from '@/components/shared/table/action-dropdown';
import CreateButton from '@/components/shared/table/create-button';
import NoItem from '@/components/shared/table/no-item';
import { Pagination } from '@/components/shared/table/pagination';
import Table from '@/components/shared/table/table';
import SearchBox from '@/components/ui/search-box';
import { TableCell, TableRow } from '@/components/ui/table';
import { Head, router } from '@inertiajs/react';
import { PenTool, Table2, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard({ data }: { data: any }) {
    const [search, setSearch] = useState('');
    const [projectCreateModalOpen, setCreateProjectModalOpen] = useState(false);
    const [projectUpdateModalOpen, setUpdateProjectModalOpen] = useState(false);
    const [updateItem, setUpdateItem] = useState(null);

    console.log(data)

    return (
        <>
            <Head title="Projects" />
            <div className="p-4 flex flex-col md:flex-row gap-6 lg:gap-4 lg:items-center justify-end rounded-t-sm border border-default border-b-0 overflow-hidden">
                <form onSubmit={() => router.visit('/projects' + '?search=' + search)}>
                    <SearchBox
                        containerClassName="mx-auto lg:ml-auto lg:mr-0"
                        value={search}
                        onChange={setSearch}
                    />
                </form>
                <CreateButton text="Create Project" onClick={() => setCreateProjectModalOpen(true)} />
            </div>
            <Table
                headers={['#', 'Name', 'Description', 'Total table', 'Actions']}
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
                                {item?.table?.length}
                            </TableCell>

                            <TableCell className="px-4 py-3 text-right">
                                <ActionDropdown
                                    actions={[
                                        {
                                            label: "All Table",
                                            onClick: () => {
                                                router.visit('/dynamic-tables?project=' + item.id);
                                            },
                                            color: "text-yellow-500 hover:text-yellow-500!",
                                            Icon: Table2
                                        },
                                        {
                                            label: "Edit",
                                            onClick: () => {
                                                setUpdateProjectModalOpen(true);
                                                setUpdateItem(item);
                                            },
                                            color: "text-green-500 hover:text-green-500!",
                                            Icon: PenTool
                                        },
                                        {
                                            label: "Delete",
                                            onClick: () => router.delete('/projects/' + item.id),
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
                page={data?.current_page}
                totalPages={data?.last_page}
                links={data?.links}
            />


            {/* modals */}
            <Modal
                isOpen={projectCreateModalOpen}
                setIsOpen={setCreateProjectModalOpen}
                icon={<img
                    src="/icons/project.png"
                    className="w-16"
                />}
            >
                <ProjectModalContents
                    handleClose={() => setCreateProjectModalOpen(false)}
                />
            </Modal>
            <Modal
                isOpen={projectUpdateModalOpen}
                setIsOpen={setUpdateProjectModalOpen}
                icon={<img
                    src="/icons/project.png"
                    className="w-16"
                />}
            >
                <ProjectModalContents
                    item={updateItem}
                    handleClose={() => setUpdateProjectModalOpen(false)}
                />
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
