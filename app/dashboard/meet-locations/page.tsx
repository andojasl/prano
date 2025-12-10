"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface MeetLocation {
  id: number;
  title: string;
  city: string;
  location: string;
  Link: string | null;
  Image: string | null;
  Date: string;
}

export default function ViewMeetLocationsPage() {
  // const router = useRouter();
  const [meetLocations, setMeetLocations] = useState<MeetLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMeetLocations();
  }, []);

  const fetchMeetLocations = async () => {
    try {
      const response = await fetch('/api/meet-locations');
      if (!response.ok) {
        throw new Error('Failed to fetch meet locations');
      }
      const data = await response.json();
      setMeetLocations(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this meet location?')) {
      return;
    }

    try {
      const response = await fetch(`/api/meet-locations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete meet location');
      }

      // Remove from local state
      setMeetLocations(prev => prev.filter(location => location.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meet Locations</h1>
          <Link
            href="/dashboard/create-meet-location"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add New Location
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading meet locations...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : meetLocations.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No meet locations found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first meet location.</p>
            <Link
              href="/dashboard/create-meet-location"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Meet Location
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetLocations.map((location: MeetLocation) => (
              <div key={location.id} className="bg-white shadow rounded-lg overflow-hidden">
                {location.Image && (
                  <div className="h-48 relative">
                    <Image
                      src={location.Image}
                      alt={location.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {location.title}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="font-medium">City:</span>
                      <span className="ml-2">{location.city}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium">Location:</span>
                      <span className="ml-2">{location.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Date:</span>
                      <span className="ml-2">{formatDate(location.Date)}</span>
                    </div>
                    {location.Link && (
                      <div className="flex items-center">
                        <span className="font-medium">Link:</span>
                        <a
                          href={location.Link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:text-blue-800 underline"
                        >
                          Visit Link
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Link
                      href={`/dashboard/meet-locations/${location.id}/edit`}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(location.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}