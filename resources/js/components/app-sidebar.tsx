import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { CircleDollarSign, ContactIcon, CreditCard, DollarSign, LayoutDashboard, Trash2Icon } from 'lucide-react';
import RubikateLogo from './rubikate-logo.png';

const mainNavItems: NavItem[] = [
    {
        title: 'Analíticas',
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
        title: 'Papelera',
        href: '/trash',
        icon: Trash2Icon,
    },
    // {
    // title: 'Trading View',
    // href: '/trading-view',
    // icon: LineChart,
    // },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Valores Históricos',
        href: '/currency-history',
        icon: DollarSign,
    },
];

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
