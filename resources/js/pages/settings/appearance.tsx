import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const FONT_CLASSES: Record<string, string> = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xl: 'text-xl',
};

const FONT_SIZE_KEY = 'appearance_font_size';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configuración del Perfil',
        href: '/settings/appearance',
    },
];
export default function Appearance() {
    const [fontSize, setFontSize] = useState('medium');

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(FONT_SIZE_KEY);
        if (stored && FONT_CLASSES[stored]) {
            setFontSize(stored);
        }
    }, []);

    // Update html class and save to localStorage
    useEffect(() => {
        Object.values(FONT_CLASSES).forEach((cls) => {
            document.documentElement.classList.remove(cls);
        });
        document.documentElement.classList.add(FONT_CLASSES[fontSize]);
        localStorage.setItem(FONT_SIZE_KEY, fontSize);
    }, [fontSize]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Configuración de Aparencia" description="Actualiza la apariencia de la aplicación" />
                    <AppearanceTabs />
                    {/* Font Size Selector */}
                    <div className="space-y-2">
                        <label htmlFor="font-size" className="block text-sm font-medium text-gray-700">
                            Tamaño de fuente
                        </label>
                        <div className="mt-1 w-48">
                            <Select name="font-size" onValueChange={setFontSize} value={fontSize}>
                                <SelectTrigger id="font-size" className="w-full">
                                    <SelectValue placeholder="Selecciona tamaño" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="small">Pequeña</SelectItem>
                                    <SelectItem value="medium">Mediana</SelectItem>
                                    <SelectItem value="large">Grande</SelectItem>
                                    <SelectItem value="xl">Extra grande</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Custom Layout Link */}
                    <div className="mt-6">
                        <a href="/settings/appearance/custom-layout" className="font-medium text-indigo-600 hover:underline">
                            Customizar Layout del Panel de Administración
                        </a>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
