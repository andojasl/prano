'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Edit3 } from 'lucide-react';

interface InlineStatusManagerProps {
  orderId: number;
  currentStatus: string;
}

export function InlineStatusManager({ orderId, currentStatus }: InlineStatusManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setSelectedStatus(currentStatus);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedStatus(currentStatus);
  };

  const handleSaveStatus = async () => {
    if (selectedStatus === currentStatus) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (response.ok) {
        setIsEditing(false);
        window.location.reload(); // Refresh to show updated status
      } else {
        alert('Failed to update order status');
      }
    } catch (_error) {
      alert('An error occurred while updating the status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          disabled={isUpdating}
          className="text-xs p-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={handleSaveStatus}
            disabled={isUpdating}
          >
            <Check className="w-3 h-3 text-green-600" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={handleCancelEdit}
            disabled={isUpdating}
          >
            <X className="w-3 h-3 text-red-600" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge className={getStatusColor(currentStatus)} variant="secondary">
        {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
      </Badge>
      <Button
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
        onClick={handleStartEdit}
      >
        <Edit3 className="w-3 h-3" />
      </Button>
    </div>
  );
} 