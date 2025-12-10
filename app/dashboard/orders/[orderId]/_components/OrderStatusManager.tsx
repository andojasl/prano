'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface OrderStatusManagerProps {
  orderId: number;
  currentStatus: string;
}

export function OrderStatusManager({ orderId, currentStatus }: OrderStatusManagerProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    setHasChanges(newStatus !== currentStatus);
  };

  const handleSaveChanges = async () => {
    if (!hasChanges) return;

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

  const handleCancelChanges = () => {
    setSelectedStatus(currentStatus);
    setHasChanges(false);
  };

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          Update Status
        </label>
        <select
          id="status"
          value={selectedStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={isUpdating}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {hasChanges && (
        <div className="flex gap-2">
          <Button
            onClick={handleSaveChanges}
            disabled={isUpdating}
            size="sm"
            className="flex-1"
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            onClick={handleCancelChanges}
            disabled={isUpdating}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      )}

      {hasChanges && !isUpdating && (
        <p className="text-sm text-amber-600">
          You have unsaved changes
        </p>
      )}
    </div>
  );
} 