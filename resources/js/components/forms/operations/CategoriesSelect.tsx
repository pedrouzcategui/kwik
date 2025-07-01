import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '@/types/category';
import { ValidationErrorPayload } from '@/types/error';
import { OperationType, OperationTypeStringUnion } from '@/types/operation';
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
    reset: (...field: any[]) => any;
};

export default function CategoriesSelect({ disabled, operationType, categories, selectedCategoryId, setData, reset }: CategorySelectProps) {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState('#FF0000');

    const [categoryType, setCategoryType] = useState<OperationTypeStringUnion>('INCOME');

    const [open, setOpen] = useState(false);

    const handleSelectCategory = (id: string) => {
        setData('category_id', id);
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) {
            toast.error('Ingresa el nombre de la categoría');
            return;
        }

        try {
            const response = await axios.post('/categories', {
                name: newCategoryName,
                color: newCategoryColor,
                type: categoryType,
            });
            const newCategory: Category = response.data;
            reset();
            toast.success(`La categoria ${newCategory.name} ha sido creada`);
            setData('category_id', newCategory.id);
            setNewCategoryName('');
            setNewCategoryColor('#FF0000');
            setOpen(false);
            router.reload({ only: ['categories'] });
        } catch (error) {
            // how the fuck this works
            const err = error as AxiosError;
            if (axios.isAxiosError<ValidationErrorPayload>(error) && error.response) {
                if (error.response.status === 422) {
                    const { message, errors } = error.response.data; // strongly typed 🎉
                    console.log('Validation failed:', message, errors);
                    toast.error(message);
                    return; // or however you bubble it up
                }
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
                            <Label>Nombre de la nueva categoría</Label>
                            <Input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="E.g: Pago por eventos" />
                        </div>
                        <Label>Selecciona el tipo de operación asociada a esta categoría</Label>
                        <Select name="type" value={categoryType} onValueChange={(type) => setCategoryType(type as OperationTypeStringUnion)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona tu tipo de operacion" />{' '}
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="INCOME">Ingreso</SelectItem>
                                    <SelectItem value="EXPENSE">Gasto</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2">
                            <Label>Color:</Label>
                            <input
                                type="color"
                                value={newCategoryColor}
                                onChange={(e) => setNewCategoryColor(e.target.value)}
                                className="h-10 w-10 rounded border"
                            />
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
