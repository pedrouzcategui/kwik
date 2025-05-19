import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category } from '@/types/category';
import { router } from '@inertiajs/react';
import axios, { AxiosError } from 'axios';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type CategorySelectProps = {
  categories: Category[];
  selectedCategoryId: string;
  setData: (x: string, y: any) => any;
};

export default function CategoriesSelect({
  categories,
  selectedCategoryId,
  setData,
}: CategorySelectProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#FF0000');
  const [newCategoryEmoji, setNewCategoryEmoji] = useState<string>('');
  const [open, setOpen] = useState(false);

  // show/hide picker
  const [showPicker, setShowPicker] = useState(false);

  const handleSelectCategory = (id: string) => {
    setData('category_id', id);
  };

  // basic keyword-to-emoji matching
  const suggestEmoji = (name: string): string => {
    const key = name.toLowerCase();
    if (key.includes('food') || key.includes('eat') || key.includes('restaurant'))
      return '🍽️';
    if (key.includes('travel') || key.includes('flight') || key.includes('trip'))
      return '✈️';
    if (key.includes('shop') || key.includes('shopping')) return '🛍️';
    if (key.includes('health') || key.includes('fitness')) return '💪';
    if (key.includes('salary') || key.includes('income') || key.includes('pay'))
      return '💰';
    if (key.includes('transport') || key.includes('taxi') || key.includes('bus'))
      return '🚗';
    return '🏷️';
  };

  // whenever the name changes, update the default emoji
  useEffect(() => {
    setNewCategoryEmoji(suggestEmoji(newCategoryName));
  }, [newCategoryName]);

  // user picks an emoji from the picker
  const handleEmojiClick = (data: EmojiClickData) => {
    setNewCategoryEmoji(data.emoji);
    setShowPicker(false);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const response = await axios.post('/categories', {
        name: newCategoryName,
        color: newCategoryColor,
        icon: newCategoryEmoji,
      });

      const newCategory: Category = response.data;
      toast.success(`La categoría ${newCategory.name} ha sido creada`);
      setData('category_id', newCategory.id);
      setNewCategoryName('');
      setNewCategoryColor('#FF0000');
      setNewCategoryEmoji('');
      setShowPicker(false);
      setOpen(false);
      router.reload({ only: ['categories'] });
    } catch (error) {
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
        <Select value={selectedCategoryId} onValueChange={handleSelectCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <Badge style={{ backgroundColor: category.color }}>
                  {category.icon} {category.name}
                </Badge>
              </SelectItem>
            ))}
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

            <div className="flex gap-6 py-2">
              <div className="flex flex-1 flex-col gap-4">
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nombre de la categoría"
                />
                <div className="flex justify-center gap-2">
                  <div className="flex items-center gap-2">
                    <Label>Color:</Label>
                    <input
                      type="color"
                      value={newCategoryColor}
                      onChange={(e) => setNewCategoryColor(e.target.value)}
                      className="h-10 w-10 rounded border"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Label>Emoji:</Label>
                    <span
                      className="text-2xl cursor-pointer"
                      onClick={() => setShowPicker((v) => !v)}
                    >
                      {newCategoryEmoji || '🏷️'}
                    </span>
                  </div>
                </div>

                {showPicker && (
                  <div className="mt-2 w-full">
                    <EmojiPicker
                      theme={Theme.DARK}
                      width="100%"
                      onEmojiClick={(emoji) =>
                        handleEmojiClick(emoji)
                      }
                      lazyLoadEmojis
                    />
                  </div>
                )}
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
