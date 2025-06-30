import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutDashboard } from 'lucide-react';
import RubikateLogo from './rubikate-logo.png';

const mainNavItems: NavItem[] = [
    {
        title: 'Usuarios',
        href: '/admin/users',
        icon: LayoutDashboard,
    },
    {
        title: 'Logs',
        href: '/admin/logs',
        icon: LayoutDashboard,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu className="text-center">
                    {/* <SidebarMenuItem>
                        <SidebarMenuButton> */}
                    {/* <Link href="/dashboard" prefetch> */}
                    <Link href="/dashboard">
                        <img src={RubikateLogo} className="mx-auto mb-4 w-full max-w-[150px] object-contain text-center" />
                    </Link>
                    {/* </SidebarMenuButton>
                    </SidebarMenuItem> */}
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
