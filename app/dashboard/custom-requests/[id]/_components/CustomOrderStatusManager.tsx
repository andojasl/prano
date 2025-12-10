'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface CustomOrderStatusManagerProps {
  customOrderId: number;
  currentStatus: string;
}

export function CustomOrderStatusManager({ customOrderId, currentStatus }: CustomOrderStatusManagerProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setHasChanges(status !== currentStatus);
  };

  const handleSaveChanges = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/custom-orders/${customOrderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to update status');
      }
    } catch (_error) {
      alert('An error occurred while updating the status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setSelectedStatus(currentStatus);
    setHasChanges(false);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Order Status
        </label>
        <select
          value={selectedStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={isUpdating}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="submitted">Submitted</option>
          <option value="reviewing">Reviewing</option>
          <option value="quoted">Quoted</option>
          <option value="approved">Approved</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {hasChanges && (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleSaveChanges}
            disabled={isUpdating}
            className="flex-1"
          >
            <Check className="w-4 h-4 mr-2" />
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isUpdating}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
} 