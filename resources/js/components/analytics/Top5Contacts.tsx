import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface Contact {
    name: string;
    total: number;
}

interface Top5ContactsProps {
    top_5_contacts_by_expense: Contact[];
}

const Top5Contacts: React.FC<Top5ContactsProps> = ({ top_5_contacts_by_expense }) => {
    return (
        <Card>
            <CardHeader className='text-right'>
                <CardTitle>Top 5 Contactos</CardTitle>
                <CardDescription>Personas a las que más has enviado dinero</CardDescription>
            </CardHeader>
            <CardContent>
                {top_5_contacts_by_expense.length > 0 ? (
                    <table className="table-auto w-full text-left">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">#</th>
                                <th className="px-4 py-2">Nombre</th>
                                <th className="px-4 py-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {top_5_contacts_by_expense.map((contact, index) => (
                                <tr key={index} className="border-t">
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{contact.name}</td>
                                    <td className="px-4 py-2 font-bold">${contact.total.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex items-center justify-center min-h-[250px] text-muted-foreground">
                        No hay datos por el momento.
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default Top5Contacts;