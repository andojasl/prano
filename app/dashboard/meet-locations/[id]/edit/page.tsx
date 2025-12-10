'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { MapPin, ArrowLeft, Save, Trash2, Calendar, LinkIcon } from 'lucide-react'
import Link from 'next/link'

interface EditMeetLocationFormData {
  title: string
  city: string
  location: string
  link: string
  date: string
}

interface MeetLocation {
  id: number
  title: string
  city: string
  location: string
  Link: string | null
  Image: string | null
  Date: string
}

export default function EditMeetLocationPage() {
  const router = useRouter()
  const params = useParams()
  const locationId = params.id as string

  const [formData, setFormData] = useState<EditMeetLocationFormData>({
    title: '',
    city: '',
    location: '',
    link: '',
    date: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [originalLocation, setOriginalLocation] = useState<MeetLocation | null>(null)

  // Fetch the existing location data
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(`/api/meet-locations/${locationId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch meet location')
        }
        const data = await response.json()
        const location = data.data
        
        setOriginalLocation(location)
        setFormData({
          title: location.title,
          city: location.city,
          location: location.location,
          link: location.Link || '',
          date: location.Date.split('T')[0] // Format date for input
        })
      } catch (_error) {
        setError('Failed to load location data')
      } finally {
        setIsLoading(false)
      }
    }

    if (locationId) {
      fetchLocation()
    }
  }, [locationId])

  const handleInputChange = (field: keyof EditMeetLocationFormData, value: string) => {
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
      const response = await fetch(`/api/meet-locations/${locationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          city: formData.city,
          location: formData.location,
          link: formData.link || null,
          date: formData.date,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update meet location')
      }

      // Redirect to meet locations page on success
      router.push('/dashboard/meet-locations')
      router.refresh()
    } catch (_error) {
      setError(_error instanceof Error ? _error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch(`/api/meet-locations/${locationId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete meet location')
      }

      // Redirect to meet locations page on success
      router.push('/dashboard/meet-locations')
      router.refresh()
    } catch (_error) {
      setError(_error instanceof Error ? _error.message : 'An unexpected error occurred')
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

  if (!originalLocation) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Meet Location Not Found</h1>
            <Link href="/dashboard/meet-locations">
              <Button>Back to Meet Locations</Button>
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
            <Link href="/dashboard/meet-locations">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Meet Locations
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Meet Location #{originalLocation.id}</h1>
          <p className="text-gray-600 mt-2">Update meet location details</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Title Field */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter the meet location title..."
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* City Field */}
              <div className="space-y-2">
                <Label htmlFor="city">
                  City <span className="text-red-500">*</span>
                </Label>
                <input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter the city..."
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Location Field */}
              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter the specific location details..."
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                />
              </div>

              {/* Date Field */}
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date <span className="text-red-500">*</span>
                </Label>
                <input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Link Field */}
              <div className="space-y-2">
                <Label htmlFor="link" className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Link
                </Label>
                <input
                  id="link"
                  type="url"
                  value={formData.link}
                  onChange={(e) => handleInputChange('link', e.target.value)}
                  placeholder="Enter a link (optional)..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500">
                  Optional link to event page, tickets, or more information
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
                  Delete Location
                </Button>
                
                <div className="flex gap-4">
                  <Link href="/dashboard/meet-locations">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || isDeleting || !formData.title.trim() || !formData.city.trim() || !formData.location.trim() || !formData.date}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isSubmitting ? 'Updating...' : 'Update Location'}
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
                Delete Meet Location #{originalLocation?.id}
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this meet location? This action cannot be undone.
              </p>
              <div className="bg-gray-50 p-3 rounded-md mb-4">
                <div className="text-xs text-gray-500 mb-1">Title:</div>
                <p className="text-sm text-gray-700 font-medium">
                  {originalLocation?.title}
                </p>
                <div className="text-xs text-gray-500 mb-1 mt-2">Location:</div>
                <p className="text-sm text-gray-700">
                  {originalLocation?.location}, {originalLocation?.city}
                </p>
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
                  {isDeleting ? 'Deleting...' : 'Delete Location'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}