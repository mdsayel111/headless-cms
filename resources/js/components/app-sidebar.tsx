import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid } from 'lucide-react';
import { NavUser } from './nav-user';

const mainNavItems: NavItem[] = [
    {
        title: 'Projects',
        href: '/projects',
        icon: LayoutGrid,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu className='hover:bg-transparent'>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className='hover:bg-transparent text-black hover:text-black'>
                            <Link href={'/projects'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <Link href={'/projects'}>
                    <NavUser />
                </Link>
            </SidebarFooter>
        </Sidebar>
    );
}
