import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '@/types/category';
import { OperationTableColumns } from '@/types/operation';
import type { Table } from '@tanstack/react-table';
import { useState } from 'react';

// filepath: /Applications/XAMPP/xamppfiles/htdocs/kwik/resources/js/pages/operations/filters/CategoryFilter.tsx

export function CategoryFilter({ table, categories }: { table: Table<OperationTableColumns>; categories: Category[] }) {
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>('all');

    const handleValueChange = (value: string) => {
        setSelectedCategory(value);
        table.getColumn('category_name')?.setFilterValue(value === 'all' ? undefined : value);
    };

    return (
        <Select value={selectedCategory} onValueChange={handleValueChange}>
            <SelectTrigger className="min-w-[200px] px-4">
                <SelectValue placeholder="Categoría" />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                        {category.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
