import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
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
                            <Select defaultValue="medium" name="font-size">
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

                    {/* Dashboard Color Selector */}
                    <div className="mt-6">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Color del Dashboard</label>
                        <div className="grid grid-cols-4 gap-4">
                            <button
                                type="button"
                                className="h-12 w-12 rounded-lg border-2 border-transparent focus:border-black focus:outline-none"
                                style={{ backgroundColor: '#8b5cf6' }} // purple-500
                                aria-label="Morado"
                            />
                            <button
                                type="button"
                                className="h-12 w-12 rounded-lg border-2 border-transparent focus:border-black focus:outline-none"
                                style={{ backgroundColor: '#22c55e' }} // green-500
                                aria-label="Verde"
                            />
                            <button
                                type="button"
                                className="h-12 w-12 rounded-lg border-2 border-transparent focus:border-black focus:outline-none"
                                style={{ backgroundColor: '#eab308' }} // mustard yellow-500
                                aria-label="Mostaza"
                            />
                            <button
                                type="button"
                                className="h-12 w-12 rounded-lg border-2 border-transparent focus:border-black focus:outline-none"
                                style={{ backgroundColor: '#3b82f6' }} // blue-500
                                aria-label="Azul"
                            />
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
