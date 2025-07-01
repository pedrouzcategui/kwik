import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    status: any;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    route: any;
    [key: string]: unknown;
}

export const ROLE_LABELS = {
    user: 'Usuario',
    admin: 'Administrador',
} as const;

export type Role = keyof typeof ROLE_LABELS; // 'user' | 'admin'

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    alert_threshold_amount: number;
    danger_threshold_amount: number;
    role: Role;
    [key: string]: unknown; // This allows for additional properties...
}
