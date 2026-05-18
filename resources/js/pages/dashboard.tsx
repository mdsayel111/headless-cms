import CreateButton from '@/components/shared/table/create-button';
import { dashboard } from '@/routes';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <>
            <div>
                <Head title="Projects" />
                <CreateButton text="Create Project" />
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Projects',
            href: dashboard(),
        },
    ],
};
