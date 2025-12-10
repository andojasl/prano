'use client'

import { useState, useCallback } from 'react';
import { Upload, X, Check, AlertCircle, Plus } from 'lucide-react';
import Image from 'next/image';

interface MultiImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  currentImages?: string[];
  label: string;
  maxImages?: number;
}

export default function MultiImageUpload({ 
  onImagesChange, 
  currentImages = [], 
  label, 
  maxImages = 10 
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>(currentImages);
  const [error, setError] = useState<string>('');

  const uploadFiles = useCallback(async (files: FileList) => {
    if (uploadedImages.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const { imageUrl } = await response.json();
        return imageUrl;
      });

      const newImageUrls = await Promise.all(uploadPromises);
      const updatedImages = [...uploadedImages, ...newImageUrls];
      
      setUploadedImages(updatedImages);
      onImagesChange(updatedImages);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [uploadedImages, maxImages, onImagesChange]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      setError('Please upload image files only');
      return;
    }

    if (imageFiles.length !== files.length) {
      setError('Some files were skipped (only images allowed)');
    }

    const fileList = new DataTransfer();
    imageFiles.forEach(file => fileList.items.add(file));
    uploadFiles(fileList.files);
  }, [uploadFiles]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFiles(files);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updatedImages = uploadedImages.filter((_, index) => index !== indexToRemove);
    setUploadedImages(updatedImages);
    onImagesChange(updatedImages);
    setError('');
  };

  const canAddMore = uploadedImages.length < maxImages;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        <span className="text-gray-500 ml-2 text-xs">
          ({uploadedImages.length}/{maxImages} images)
        </span>
      </label>

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-300">
                <Image
                  src={imageUrl}
                  alt={`Additional image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${isUploading ? 'opacity-50' : ''}`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          <div className="space-y-3">
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-sm text-gray-600 mt-2">Uploading images...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  {uploadedImages.length === 0 ? (
                    <Upload className="h-10 w-10 text-gray-400" />
                  ) : (
                    <Plus className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">
                    {uploadedImages.length === 0 
                      ? 'Drop images here or click to upload'
                      : 'Add more images'
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, WebP up to 5MB each
                  </p>
                  <p className="text-xs text-gray-500">
                    You can select multiple files at once
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Success Message */}
      {uploadedImages.length > 0 && (
        <div className="flex items-center text-green-600 text-sm">
          <Check size={16} className="mr-1" />
          {uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''} uploaded successfully
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center text-red-500 text-sm">
          <AlertCircle size={16} className="mr-1" />
          {error}
        </div>
      )}

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name="images"
        value={uploadedImages.join(',')}
      />
    </div>
  );
} 