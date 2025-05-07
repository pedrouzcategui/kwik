import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Banknote, BookOpen, CircleDollarSign, ContactIcon, CreditCard, DollarSign, Folder, LayoutDashboard, LineChart } from 'lucide-react';

const mainNavItems: NavItem[] = [
    {
        title: 'Analiticas',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Contactos',
        href: '/contacts',
        icon: ContactIcon,
    },
    {
        title: 'Cuentas',
        href: '/accounts',
        icon: CreditCard,
    },
    {
        title: 'Operaciones',
        href: '/operations',
        icon: CircleDollarSign,
    },
    // {
        // title: 'Trading View',
        // href: '/trading-view',
        // icon: LineChart,
    // },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Valor Histórico del Dólar',
        href: '#',
        icon: DollarSign,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                               <span className='text-3xl text-center w-full font-bold uppercase'>KWIK</span> 
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
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
