'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';

interface CustomOrderQuoteManagerProps {
  customOrderId: number;
  currentQuotedPrice?: number;
  currentQuotedTimeline?: number;
  currentAdminNotes?: string;
}

export function CustomOrderQuoteManager({ 
  customOrderId, 
  currentQuotedPrice, 
  currentQuotedTimeline, 
  currentAdminNotes 
}: CustomOrderQuoteManagerProps) {
  const [quotedPrice, setQuotedPrice] = useState(currentQuotedPrice?.toString() || '');
  const [quotedTimeline, setQuotedTimeline] = useState(currentQuotedTimeline?.toString() || '');
  const [adminNotes, setAdminNotes] = useState(currentAdminNotes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const hasChanges = () => {
    return (
      quotedPrice !== (currentQuotedPrice?.toString() || '') ||
      quotedTimeline !== (currentQuotedTimeline?.toString() || '') ||
      adminNotes !== (currentAdminNotes || '')
    );
  };

  const handleSaveChanges = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/custom-orders/${customOrderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quotedPrice: quotedPrice || null,
          quotedTimelineWeeks: quotedTimeline || null,
          adminNotes: adminNotes || null,
        }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to update quote');
      }
    } catch (error) {
      console.error('Error updating quote:', error);
      alert('An error occurred while updating the quote');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setQuotedPrice(currentQuotedPrice?.toString() || '');
    setQuotedTimeline(currentQuotedTimeline?.toString() || '');
    setAdminNotes(currentAdminNotes || '');
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="quotedPrice">Quoted Price (€)</Label>
        <Input
          id="quotedPrice"
          type="number"
          step="0.01"
          min="0"
          value={quotedPrice}
          onChange={(e) => setQuotedPrice(e.target.value)}
          placeholder="Enter quoted price"
        />
      </div>

      <div>
        <Label htmlFor="quotedTimeline">Quoted Timeline (weeks)</Label>
        <Input
          id="quotedTimeline"
          type="number"
          min="1"
          value={quotedTimeline}
          onChange={(e) => setQuotedTimeline(e.target.value)}
          placeholder="Enter timeline in weeks"
        />
      </div>

      <div>
        <Label htmlFor="adminNotes">Admin Notes</Label>
        <textarea
          id="adminNotes"
          rows={3}
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Internal notes about this custom order..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {hasChanges() && (
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