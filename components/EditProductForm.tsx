'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProduct, State } from "@/app/lib/actions";
import { useActionState, useState, useEffect } from "react";
import FileUpload from "./FileUpload";
import MultiImageUpload from "./MultiImageUpload";
import SizeManager from "./SizeManager";
import DeleteProductButton from "./DeleteProductButton";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  title: string;
  description?: string;
  image: string;
  hover_image?: string;
  price: number;
  ready?: boolean;
  category: number;
  material_details?: string;
  care_details?: string;
  deliver_details?: string;
  images?: string[];
  available_sizes?: any;
}

interface EditProductFormProps {
  categories: Category[];
  product: Product;
}

export default function EditProductForm({ categories, product }: EditProductFormProps) {
  const initialState: State = { message: null, errors: {} };
  const updateProductWithId = updateProduct.bind(null, product.id);
  const [state, formAction] = useActionState(updateProductWithId, initialState);
  
  const [mainImage, setMainImage] = useState(product.image || '');
  const [hoverImage, setHoverImage] = useState(product.hover_image || '');
  const [additionalImages, setAdditionalImages] = useState<string[]>(product.images || []);
  const [sizes, setSizes] = useState<any[]>([]);

  // Load sizes from product data
  useEffect(() => {
    if (product.available_sizes) {
      setSizes(product.available_sizes);
    }
  }, [product.available_sizes]);

  const handleSubmit = (formData: FormData) => {
    if (!mainImage) {
      alert('Please upload a main image before submitting the form.');
      return;
    }
    
    // Additional client-side validation
    const title = formData.get('title') as string;
    const price = formData.get('price') as string;
    const category = formData.get('category') as string;
    
    if (!title?.trim()) {
      alert('Please enter a product title.');
      return;
    }
    
    if (!price?.trim()) {
      alert('Please enter a product price.');
      return;
    }
    
    if (!category) {
      alert('Please select a category.');
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
            defaultValue={product.title}
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
            defaultValue={product.price}
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

        <div className="flex flex-col gap-4">
        {/* Category */}
        <div>
          <Label htmlFor="category">Category*</Label>
          <select
            id="category"
            name="category"
            defaultValue={product.category}
            className="mt-1 px-2 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={product.description || ''}
          className="mt-1 block w-full h-64 rounded-md border px-2 py-2 shadow-sm focus:border-black focus:ring-black sm:text-sm"
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

             {/* Available Sizes */}
       <div>
         <SizeManager
           label="Available Sizes & Stock"
           onSizesChange={setSizes}
           initialSizes={product.available_sizes}
         />
         <div id="sizes-error" aria-live="polite" aria-atomic="true">
           {state.errors?.sizes &&
             state.errors.sizes.map((error: string) => (
               <p className="mt-2 text-sm text-red-500" key={error}>
                 {error}
               </p>
             ))}
         </div>
       </div>
      </div>

        <div className="flex flex-col gap-4">
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
            defaultValue={product.material_details || ''}
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
            defaultValue={product.care_details || ''}
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
            defaultValue={product.deliver_details || ''}
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
          defaultChecked={product.ready || false}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <Label htmlFor="ready" className="ml-2">
          Product is ready for sale
        </Label>
      </div>

      {/* Hidden input for sizes data */}
      <input
        type="hidden"
        name="sizes"
        value={JSON.stringify(sizes)}
      />

      {/* Hidden input for additional images */}
      <input
        type="hidden"
        name="images"
        value={additionalImages.join(',')}
      />

      {/* Error Message */}
      <div id="customer-error" aria-live="polite" aria-atomic="true">
        {state.message && (
          <div className="mt-2 text-sm text-red-500">
            {state.message}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-between items-center">
        <DeleteProductButton
          productId={product.id}
          productTitle={product.title}
          variant="destructive"
          size="sm"
        />
        
        <div className="flex gap-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
            Update Product
          </Button>
        </div>
      </div>
    </form>
  );
} 