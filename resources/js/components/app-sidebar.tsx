import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { CircleDollarSign, ContactIcon, CreditCard, DollarSign, LayoutDashboard } from 'lucide-react';
import RubikateLogo from './rubikate-logo.png';

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
    {
        title: 'Valores Históricos',
        href: '/currency-history',
        icon: DollarSign,
    },
    // {
    // title: 'Trading View',
    // href: '/trading-view',
    // icon: LineChart,
    // },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    {/* <SidebarMenuItem>
                        <SidebarMenuButton> */}
                    <Link href="/dashboard" prefetch>
                        <img src={RubikateLogo} className="mb-4 w-full object-contain" />
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
