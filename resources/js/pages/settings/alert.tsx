import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ChangeEvent, FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configuración del Perfil',
        href: '/settings/alert',
    },
];

type AlertThresholdForm = {
    alert_threshold_amount: number;
    danger_threshold_amount: number;
};

export default function Alert({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<AlertThresholdForm>>({
        alert_threshold_amount: auth.user.alert_threshold_amount ?? 0,
        danger_threshold_amount: auth.user.danger_threshold_amount ?? 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('alert.update'), {
            preserveScroll: true,
            only: ['user'],
            onSuccess: () => {
                toast.success('El monto ha sido actualizado exitosamente');
            },
        });
    };

    const handleAlertAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value == '') {
            setData(e.target.name as keyof AlertThresholdForm, 0);
            return;
        }
        setData(e.target.name as keyof AlertThresholdForm, parseFloat(e.target.value));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuración del Perfil" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Monto de Alerta"
                        description="Si tu total disponible (en dólares) está entre 0 y este monto, tu sistema entrará en estado de alerta."
                    />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="alert_amount">
                                Actualiza tu monto de <Badge className="mx-2 bg-yellow-400 text-yellow-900">alerta</Badge> deseado
                            </Label>
                            <Input
                                id="number"
                                step={0.01}
                                min={10}
                                className="mt-1 block w-full"
                                value={data.alert_threshold_amount}
                                onChange={handleAlertAmountChange}
                                name="alert_threshold_amount"
                                required
                                placeholder="E.g: $500"
                            />

                            <InputError className="mt-2" message={errors.alert_threshold_amount} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="danger_amount">
                                Actualiza tu monto de alerta de <Badge className="mx-2 bg-red-400 text-red-900">peligro</Badge> deseado
                            </Label>
                            <Input
                                id="number"
                                step={0.01}
                                min={10}
                                className="mt-1 block w-full"
                                value={data.danger_threshold_amount}
                                onChange={handleAlertAmountChange}
                                name="danger_threshold_amount"
                                required
                                placeholder="E.g: $500"
                            />

                            <InputError className="mt-2" message={errors.danger_threshold_amount} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Guardar</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Guardado</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
