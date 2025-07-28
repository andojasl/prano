'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteProduct } from '@/app/lib/actions';

interface DeleteProductButtonProps {
  productId: string;
  productTitle: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showText?: boolean;
  redirectTo?: string;
}

export default function DeleteProductButton({ 
  productId, 
  productTitle, 
  variant = 'destructive',
  size = 'sm',
  className = '',
  showText = true,
  redirectTo = '/dashboard/view-products'
}: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${productTitle}"?\n\nThis action cannot be undone and will permanently remove the product and all its associated data.`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const result = await deleteProduct(productId);
      
      if (result.success) {
        // Show success message
        alert(result.message);
        // Redirect to products page
        router.push(redirectTo);
        router.refresh();
      } else {
        // Show error message
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An unexpected error occurred while deleting the product.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      onClick={handleDelete}
      disabled={isDeleting}
      variant={variant}
      size={size}
      className={className}
    >
      <Trash2 className="h-4 w-4" />
      {showText && (
        <span className="ml-2">
          {isDeleting ? 'Deleting...' : 'Delete'}
        </span>
      )}
    </Button>
  );
} 