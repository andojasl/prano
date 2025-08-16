'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DeleteCustomOrderButtonProps {
  customOrderId: number;
  orderTitle: string;
}

export function DeleteCustomOrderButton({ customOrderId, orderTitle }: DeleteCustomOrderButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm(`Are you sure you want to delete the custom order "${orderTitle}"? This action cannot be undone.`);
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/custom-orders/${customOrderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/dashboard/custom-orders');
      } else {
        alert('Failed to delete custom order');
      }
    } catch (error) {
      console.error('Error deleting custom order:', error);
      alert('An error occurred while deleting the custom order');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="w-full"
    >
      <Trash2 className="w-4 h-4 mr-2" />
      {isDeleting ? 'Deleting...' : 'Delete Custom Order'}
    </Button>
  );
} 