import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '@/types/category';
import { router } from '@inertiajs/react';
import { useState } from 'react';

type CategorySelectProps = {
    categories: Category[];
    selectedCategoryId: string;
    setData: (x: string, y: any) => any
}

export default function CategoriesSelect({ categories, selectedCategoryId, setData}: CategorySelectProps) {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showInput, setShowInput] = useState(false);

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;

        const newCategory = await router.post("/categories"); // expects { id, name }
        setNewCategoryName(''); // Reset!
        setShowInput(false);
    };

    return (
        <div>
            <Label className="mb-2 block">Categoría</Label>
            <Select value={selectedCategoryId} onValueChange={(id) => setData('category_id', id)}>
                <SelectTrigger>
                    <SelectValue placeholder={'Selecciona o crea una categoría'} />
                </SelectTrigger>
                <SelectContent>
                    {categories.map((category: Category) => (
                        <SelectItem key={category.id} value={category.id}>
                            <div>{category.name}</div>
                        </SelectItem>
                    ))}

                    <div className="px-2 py-2 border-t border-muted">
                        {!showInput ? (
                            <button
                                onClick={() => setShowInput(true)}
                                className="text-sm text-blue-500 hover:underline"
                            >
                                + Crear nueva categoría
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    className="text-sm border px-2 py-1 w-full rounded"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Nueva categoría..."
                                />
                                <button
                                    onClick={handleCreateCategory}
                                    className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
                                >
                                    Crear
                                </button>
                            </div>
                        )}
                    </div>
                </SelectContent>
            </Select>
        </div>
    );
}
