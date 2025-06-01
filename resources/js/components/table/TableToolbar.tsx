import React from 'react';

type Props = {
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
    placeholder: string;
    /** Anything you put between `<TableToolbar>…</TableToolbar>` appears on the right */
    children?: React.ReactNode;
};

export function TableToolbar({ globalFilter, setGlobalFilter, placeholder, children }: Props) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <input
                type="text"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder={placeholder}
                className="rounded border p-2"
            />
            <div className="flex grow justify-between">{children}</div>
        </div>
    );
}
