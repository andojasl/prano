'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { FileText, ArrowLeft, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface EditTextFormData {
  text: string
  english: string
}

interface TextItem {
  id: number
  text: string
  english: string | null
}

export default function EditTextPage() {
  const router = useRouter()
  const params = useParams()
  const textId = params.id as string

  const [formData, setFormData] = useState<EditTextFormData>({
    text: '',
    english: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [originalText, setOriginalText] = useState<TextItem | null>(null)

  // Fetch the existing text data
  useEffect(() => {
    const fetchText = async () => {
      try {
        const response = await fetch(`/api/texts/${textId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch text')
        }
        const data = await response.json()
        const text = data.text
        
        setOriginalText(text)
        setFormData({
          text: text.text,
          english: text.english || ''
        })
      } catch (error) {
        console.error('Error fetching text:', error)
        setError('Failed to load text data')
      } finally {
        setIsLoading(false)
      }
    }

    if (textId) {
      fetchText()
    }
  }, [textId])

  const handleInputChange = (field: keyof EditTextFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/texts/${textId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update text')
      }

      // Redirect to texts page on success
      router.push('/dashboard/texts')
      router.refresh()
    } catch (error) {
      console.error('Error updating text:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch(`/api/texts/${textId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete text')
      }

      // Redirect to texts page on success
      router.push('/dashboard/texts')
      router.refresh()
    } catch (error) {
      console.error('Error deleting text:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirmation(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!originalText) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Text Not Found</h1>
            <Link href="/dashboard/texts">
              <Button>Back to Texts</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard/texts">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Texts
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Text #{originalText.id}</h1>
          <p className="text-gray-600 mt-2">Update text content and English translation</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Text Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Lithuanian Text Field */}
              <div className="space-y-2">
                <Label htmlFor="text">
                  Lithuanian Text <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="text"
                  value={formData.text}
                  onChange={(e) => handleInputChange('text', e.target.value)}
                  placeholder="Enter the text content in Lithuanian..."
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                />
              </div>

              {/* English Text Field */}
              <div className="space-y-2">
                <Label htmlFor="english">
                  English Text
                </Label>
                <textarea
                  id="english"
                  value={formData.english}
                  onChange={(e) => handleInputChange('english', e.target.value)}
                  placeholder="Enter the text content in English..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                />
                <p className="text-sm text-gray-500">
                  Optional English translation of the text
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <Button 
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteConfirmation(true)}
                  disabled={isSubmitting || isDeleting}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Text
                </Button>
                
                <div className="flex gap-4">
                  <Link href="/dashboard/texts">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || isDeleting || !formData.text.trim()}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isSubmitting ? 'Updating...' : 'Update Text'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Text #{originalText?.id}
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this text? This action cannot be undone.
              </p>
              <div className="bg-gray-50 p-3 rounded-md mb-4">
                <div className="text-xs text-gray-500 mb-1">Lithuanian Text:</div>
                <p className="text-sm text-gray-700 italic">
                  "{originalText?.text && originalText.text.length > 100 
                    ? `${originalText.text.substring(0, 100)}...` 
                    : originalText?.text}"
                </p>
                {originalText?.english && (
                  <>
                    <div className="text-xs text-blue-600 mb-1 mt-2">English Text:</div>
                    <p className="text-sm text-gray-700 italic">
                      "{originalText.english.length > 100 
                        ? `${originalText.english.substring(0, 100)}...` 
                        : originalText.english}"
                    </p>
                  </>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirmation(false)}
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
                  {isDeleting ? 'Deleting...' : 'Delete Text'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

