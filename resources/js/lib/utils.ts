import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { saveAs } from 'file-saver';
import { Table } from '@tanstack/react-table';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
export const currencyMap = {
    USD: '$',
    EUR: '€',
    VES: 'Bs.',
    VEF: 'Bs.',
};

export function getInitials(name: string): string {
    const words = name.trim().split(/\s+/);
    const initials = words.map((w) => w[0]?.toUpperCase() || '');
    return (initials[0] || '') + (initials[1] || initials[0] || '');
}


