import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { TrashedAccount, TrashedContact, TrashedOperation } from '@/types/trash';
import { Head } from '@inertiajs/react';
import React, { HTMLProps } from 'react';
import TrashedAccountsTable from './TrashedAccountsTable';
import TrashedContactsTable from './TrashedContactsTable';
import TrashedOperationsTable from './TrashedOperationsTable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Papelera',
        href: '/trash',
    },
];

type OperationsTablePageProps = {
    contacts: TrashedContact[];
    accounts: TrashedAccount[];
    operations: TrashedOperation[];
};

export default function Index({ contacts, accounts, operations }: OperationsTablePageProps) {
    console.log(operations);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Papelera" />
            <Tabs defaultValue="contacts">
                <TabsList>
                    <TabsTrigger value="contacts">Contactos</TabsTrigger>
                    <TabsTrigger value="accounts">Cuentas</TabsTrigger>
                    <TabsTrigger value="operations">Operaciones</TabsTrigger>
                </TabsList>
                <TabsContent value="contacts">
                    <TrashedContactsTable contacts={contacts} />
                </TabsContent>
                <TabsContent value="accounts">
                    <TrashedAccountsTable accounts={accounts} />
                </TabsContent>
                <TabsContent value="operations">
                    <TrashedOperationsTable operations={operations} />
                </TabsContent>
            </Tabs>
        </AppLayout>
    );
}

function IndeterminateCheckbox({ indeterminate, className = '', ...rest }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
    const ref = React.useRef<HTMLInputElement>(null!);

    React.useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate;
        }
    }, [ref, indeterminate]);

    return <input type="checkbox" ref={ref} className={className + ' cursor-pointer'} {...rest} />;
}
