'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface DeleteTextButtonProps {
  textId: number
  textPreview: string
}

export default function DeleteTextButton({ textId, textPreview }: DeleteTextButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/texts/${textId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete text')
      }

      // Refresh the page to show updated list
      router.refresh()
      setShowConfirmation(false)
    } catch (error) {
      console.error('Error deleting text:', error)
      alert('Failed to delete text. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Text #{textId}
          </h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this text? This action cannot be undone.
          </p>
          <div className="bg-gray-50 p-3 rounded-md mb-4">
            <p className="text-sm text-gray-700 italic">
              &ldquo;{textPreview.length > 100 ? `${textPreview.substring(0, 100)}...` : textPreview}&rdquo;
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setShowConfirmation(true)}
      className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
      Delete
    </Button>
  )
}

