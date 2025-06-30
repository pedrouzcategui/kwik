import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const currencyMap = {
    USD: '$',
    EUR: '€',
    VES: 'Bs.',
    VEF: 'Bs.',
};

export const contactTypes = ['NATURAL', 'GOVERNMENT', 'BUSINESS', 'NON-PROFIT', 'INSTITUTIONAL'] as const;

export type ContactType = (typeof contactTypes)[number];

export const contactTypeMap: Record<ContactType, string> = {
    NATURAL: 'Persona Natural',
    GOVERNMENT: 'Gobierno',
    BUSINESS: 'Empresa',
    'NON-PROFIT': 'Org. sin fines de lucro',
    INSTITUTIONAL: 'Institución',
};

export function getInitials(name: string): string {
    const words = name.trim().split(/\s+/);
    const initials = words.map((w) => w[0]?.toUpperCase() || '');
    return (initials[0] || '') + (initials[1] || initials[0] || '');
}
