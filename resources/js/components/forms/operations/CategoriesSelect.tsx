import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '@/types/category';
import { OperationType } from '@/types/operation';
import { router } from '@inertiajs/react';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

type CategorySelectProps = {
    operationType: `${OperationType}`;
    categories: Category[];
    selectedCategoryId: string;
    setData: (x: string, y: any) => any;
    disabled: boolean;
};

export default function CategoriesSelect({ disabled, operationType, categories, selectedCategoryId, setData }: CategorySelectProps) {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState('#FF0000');
    const [open, setOpen] = useState(false);

    const handleSelectCategory = (id: string) => {
        setData('category_id', id);
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;

        try {
            const response = await axios.post('/categories', {
                name: newCategoryName,
                color: newCategoryColor,
            });

            const newCategory: Category = response.data;
            toast.success(`La categoria ${newCategory.name} ha sido creada`);
            setData('category_id', newCategory.id);
            setNewCategoryName('');
            setNewCategoryColor('#FF0000');
            setOpen(false);
            router.reload({ only: ['categories'] });
        } catch (error) {
            // how the fuck this works
            const err = error as AxiosError;
            if (err.response?.status === 422) {
                console.log('Validation errors:', err.response.data);
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };
    return (
        <div className="space-y-2">
            <Label className="block">Categoría</Label>
            <div className="flex items-end gap-2">
                <Select value={selectedCategoryId} onValueChange={handleSelectCategory} disabled={disabled}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories
                            .filter((c) => c.type === operationType) // keep only the wanted ones
                            .map(
                                (
                                    c, // ↙︎ make each into a component
                                ) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        <Badge style={{ backgroundColor: c.color }}>{c.name}</Badge>
                                    </SelectItem>
                                ),
                            )}
                    </SelectContent>
                </Select>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button type="button" variant="outline">
                            + Nueva categoría
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Crear nueva categoría</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-4 py-2">
                            <Input
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Nombre de la categoría"
                            />
                            <div className="flex items-center gap-2">
                                <Label>Color:</Label>
                                <input
                                    type="color"
                                    value={newCategoryColor}
                                    onChange={(e) => setNewCategoryColor(e.target.value)}
                                    className="h-10 w-10 rounded border"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" onClick={handleCreateCategory}>
                                Crear categoría
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
