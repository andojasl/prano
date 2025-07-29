'use client'

import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Size {
  id: string;
  size: string;
  quantity: number;
}

interface SizeManagerProps {
  onSizesChange: (sizes: Size[]) => void;
  label: string;
  initialSizes?: Array<{ size: string; quantity: number }>;
}

export default function SizeManager({ onSizesChange, label, initialSizes }: SizeManagerProps) {
  const [sizes, setSizes] = useState<Size[]>([]);

  // Initialize sizes from initialSizes prop
  useEffect(() => {
    if (initialSizes && initialSizes.length > 0) {
      const formattedSizes = initialSizes.map((size, index) => ({
        id: `${Date.now()}-${index}`,
        size: size.size || '',
        quantity: size.quantity || 0,
      }));
      setSizes(formattedSizes);
      onSizesChange(formattedSizes);
    }
  }, [initialSizes, onSizesChange]);

  const addSize = () => {
    const newSize: Size = {
      id: Date.now().toString(),
      size: '',
      quantity: 0,
    };
    const updatedSizes = [...sizes, newSize];
    setSizes(updatedSizes);
    onSizesChange(updatedSizes);
  };

  const removeSize = (id: string) => {
    const updatedSizes = sizes.filter(size => size.id !== id);
    setSizes(updatedSizes);
    onSizesChange(updatedSizes);
  };

  const updateSize = (id: string, field: 'size' | 'quantity', value: string | number) => {
    const updatedSizes = sizes.map(size =>
      size.id === id
        ? { ...size, [field]: field === 'quantity' ? Number(value) : value }
        : size
    );
    setSizes(updatedSizes);
    onSizesChange(updatedSizes);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <Button
          type="button"
          onClick={addSize}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add Size
        </Button>
      </div>

      {sizes.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 text-sm">No sizes added yet</p>
          <p className="text-gray-400 text-xs mt-1">Click &quot;Add Size&quot; to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sizes.map((sizeItem) => (
            <div key={sizeItem.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <Label htmlFor={`size-${sizeItem.id}`} className="text-xs text-gray-600">
                  Size
                </Label>
                <Input
                  id={`size-${sizeItem.id}`}
                  type="text"
                  placeholder="e.g., S, M, L, 38, 40"
                  value={sizeItem.size}
                  onChange={(e) => updateSize(sizeItem.id, 'size', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="w-24">
                <Label htmlFor={`quantity-${sizeItem.id}`} className="text-xs text-gray-600">
                  Qty
                </Label>
                <Input
                  id={`quantity-${sizeItem.id}`}
                  type="number"
                  min="0"
                  placeholder="0"
                  value={sizeItem.quantity || ''}
                  onChange={(e) => updateSize(sizeItem.id, 'quantity', e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button
                type="button"
                onClick={() => removeSize(sizeItem.id)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-6"
              >
                <X size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {sizes.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>{sizes.length}</strong> size{sizes.length !== 1 ? 's' : ''} added
            {sizes.some(s => s.quantity > 0) && (
              <span className="ml-2">
                • Total stock: <strong>{sizes.reduce((sum, s) => sum + (s.quantity || 0), 0)}</strong>
              </span>
            )}
          </p>
        </div>
      )}

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name="sizes"
        value={JSON.stringify(sizes)}
      />
    </div>
  );
} 