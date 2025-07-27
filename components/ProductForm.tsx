'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProduct, State } from "@/app/lib/actions";
import { useActionState, useState } from "react";
import FileUpload from "./FileUpload";
import MultiImageUpload from "./MultiImageUpload";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function ProductForm({ categories }: { categories: Category[] }) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createProduct, initialState);
  const [mainImage, setMainImage] = useState('');
  const [hoverImage, setHoverImage] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  const handleSubmit = (formData: FormData) => {
    if (!mainImage) {
      alert('Please upload a main image before submitting the form.');
      return;
    }
    formAction(formData);
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <Label htmlFor="title">Product Title*</Label>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="Enter product title"
            className="mt-1"
            aria-describedby="title-error"
          />
          <div id="title-error" aria-live="polite" aria-atomic="true">
            {state.errors?.title &&
              state.errors.title.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>



        {/* Price */}
        <div>
          <Label htmlFor="price">Price (€)*</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className="mt-1"
            aria-describedby="price-error"
          />
          <div id="price-error" aria-live="polite" aria-atomic="true">
            {state.errors?.price &&
              state.errors.price.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category">Category*</Label>
          <select
            id="category"
            name="category"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            aria-describedby="category-error"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div id="category-error" aria-live="polite" aria-atomic="true">
            {state.errors?.category &&
              state.errors.category.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Main Image */}
        <div>
          <FileUpload
            label="Main Image"
            required={true}
            onUpload={setMainImage}
            currentImage={mainImage}
          />
          <input type="hidden" name="image" value={mainImage} />
          <div id="image-error" aria-live="polite" aria-atomic="true">
            {state.errors?.image &&
              state.errors.image.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Hover Image */}
        <div>
          <FileUpload
            label="Hover Image"
            required={false}
            onUpload={setHoverImage}
            currentImage={hoverImage}
          />
          <input type="hidden" name="hover_image" value={hoverImage} />
          <div id="hover-image-error" aria-live="polite" aria-atomic="true">
            {state.errors?.hover_image &&
              state.errors.hover_image.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Product description..."
          aria-describedby="description-error"
        />
        <div id="description-error" aria-live="polite" aria-atomic="true">
          {state.errors?.description &&
            state.errors.description.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Sizes */}
        <div>
          <Label htmlFor="available_sizes">Available Sizes</Label>
          <Input
            id="available_sizes"
            name="available_sizes"
            type="text"
            placeholder="S, M, L, XL (comma-separated)"
            className="mt-1"
            aria-describedby="sizes-error"
          />
          <p className="mt-1 text-sm text-gray-500">Separate sizes with commas</p>
          <div id="sizes-error" aria-live="polite" aria-atomic="true">
            {state.errors?.available_sizes &&
              state.errors.available_sizes.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Additional Images */}
        <div className="md:col-span-2">
          <MultiImageUpload
            label="Additional Images"
            onImagesChange={setAdditionalImages}
            currentImages={additionalImages}
            maxImages={8}
          />
          <div id="images-error" aria-live="polite" aria-atomic="true">
            {state.errors?.images &&
              state.errors.images.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>

      {/* Details Fields */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="material_details">Material Details</Label>
          <textarea
            id="material_details"
            name="material_details"
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Material composition and details..."
          />
        </div>

        <div>
          <Label htmlFor="care_details">Care Instructions</Label>
          <textarea
            id="care_details"
            name="care_details"
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="How to care for this product..."
          />
        </div>

        <div>
          <Label htmlFor="deliver_details">Delivery Details</Label>
          <textarea
            id="deliver_details"
            name="deliver_details"
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Shipping and delivery information..."
          />
        </div>
      </div>

      {/* Ready Checkbox */}
      <div className="flex items-center">
        <input
          id="ready"
          name="ready"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <Label htmlFor="ready" className="ml-2">
          Product is ready for sale
        </Label>
      </div>

      {/* Error Message */}
      <div id="customer-error" aria-live="polite" aria-atomic="true">
        {state.message && (
          <div className="mt-2 text-sm text-red-500">
            {state.message}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
          Create Product
        </Button>
      </div>
    </form>
  );
} 