'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Zod schema for product validation
const ProductSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  
  description: z.string().optional(),
  
  image: z.string().min(1, { message: 'Main image is required.' }),
  
  hover_image: z.string().optional(),
  
  price: z.coerce
    .number({ message: 'Please enter a valid price.' })
    .positive({ message: 'Price must be greater than 0.' }),
  
  ready: z.boolean().optional(),
  
  category: z.coerce
    .number({ message: 'Please select a category.' })
    .int({ message: 'Category must be a valid number.' }),
  
  material_details: z.string().optional(),
  care_details: z.string().optional(),
  deliver_details: z.string().optional(),
  
  images: z.string().optional(), // Will be converted to array
  
  sizes: z.string().optional(), // JSON string of size/quantity pairs
})

export type State = {
  errors?: {
    title?: string[]
    description?: string[]
    image?: string[]
    hover_image?: string[]
    price?: string[]
    ready?: string[]
    category?: string[]
    material_details?: string[]
    care_details?: string[]
    deliver_details?: string[]
    images?: string[]
    sizes?: string[]
  }
  message?: string | null
}

export async function createProduct(prevState: State, formData: FormData): Promise<State> {
  // Validate form using Zod
  const validatedFields = ProductSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    image: formData.get('image'),
    hover_image: formData.get('hover_image'),
    price: formData.get('price'),
    ready: formData.get('ready') === 'on',
    category: formData.get('category'),
    material_details: formData.get('material_details'),
    care_details: formData.get('care_details'),
    deliver_details: formData.get('deliver_details'),
    images: formData.get('images'),
    sizes: formData.get('sizes'),
  })

  // If form validation fails, return errors early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to create product.',
    }
  }

  // Prepare data for insertion into the database
  const { 
    title, 
    description, 
    image, 
    hover_image, 
    price, 
    ready, 
    category, 
    material_details, 
    care_details, 
    deliver_details, 
    images,
    sizes 
  } = validatedFields.data

  // Generate slug from title
  const slug = title.replace(/\s+/g, "-").toLowerCase();

  // Parse sizes JSON if provided
  let sizesData: Array<{size: string, quantity: number}> = [];
  if (sizes && sizes.trim()) {
    try {
      const parsedSizes = JSON.parse(sizes);
      sizesData = parsedSizes.filter((s: {size?: string, quantity?: number}) => s.size && s.size.trim());
    } catch (error) {
    }
  }

  // Convert comma-separated strings to arrays
  const imagesArray = images && images.trim() 
    ? images.split(',').map(img => img.trim()).filter(img => img.length > 0)
    : null

  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) {
      return {
        message: 'Authentication required. Please log in.',
      }
    }

    // Insert product into database and get the ID
    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert({
        title,
        description: description || null,
        image,
        hover_image: hover_image || null,
        price,
        ready: ready || false,
        category,
        material_details: material_details || null,
        care_details: care_details || null,
        deliver_details: deliver_details || null,
        images: imagesArray,
        slug,
      })
      .select('id')
      .single()

    if (productError) {
      
      // Handle specific database errors
      if (productError.code === '23505') {
        if (productError.message.includes('title')) {
          return {
            errors: { title: ['A product with this title already exists.'] },
            message: 'Failed to create product.',
          }
        }
        if (productError.message.includes('slug')) {
          return {
            errors: { title: ['A product with this title already exists (slug conflict).'] },
            message: 'Failed to create product.',
          }
        }
      }
      
      return {
        message: 'Database Error: Failed to create product.',
      }
    }

    // Insert sizes into the sizes table if we have any
    if (sizesData.length > 0 && productData?.id) {
      const sizesToInsert = sizesData.map(sizeItem => ({
        product_id: productData.id,
        size: sizeItem.size,
        quantity: sizeItem.quantity || 0,
      }));

      const { error: sizesError } = await supabase
        .from('sizes')
        .insert(sizesToInsert);

      if (sizesError) {
        // Note: Product was created successfully, but sizes failed
        // We could decide to rollback or just log the error
        return {
          message: 'Product created but failed to save sizes. Please edit the product to add sizes.',
        }
      }
    }

  } catch (error) {
    return {
      message: 'Server Error: Failed to create product.',
    }
  }

  // Revalidate cache and redirect
  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function updateProduct(productId: string, prevState: State, formData: FormData): Promise<State> {
  // Validate form using Zod
  const validatedFields = ProductSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    image: formData.get('image'),
    hover_image: formData.get('hover_image'),
    price: formData.get('price'),
    ready: formData.get('ready') === 'on',
    category: formData.get('category'),
    material_details: formData.get('material_details'),
    care_details: formData.get('care_details'),
    deliver_details: formData.get('deliver_details'),
    images: formData.get('images'),
    sizes: formData.get('sizes'),
  })

  // If form validation fails, return errors early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to update product.',
    }
  }

  // Prepare data for updating the database
  const { 
    title, 
    description, 
    image, 
    hover_image, 
    price, 
    ready, 
    category, 
    material_details, 
    care_details, 
    deliver_details, 
    images,
    sizes 
  } = validatedFields.data

  // Generate slug from title
  const slug = title.replace(/\s+/g, "-").toLowerCase();

  // Parse sizes JSON if provided
  let sizesData: Array<{size: string, quantity: number}> = [];
  if (sizes && sizes.trim()) {
    try {
      const parsedSizes = JSON.parse(sizes);
      sizesData = parsedSizes.filter((s: {size?: string, quantity?: number}) => s.size && s.size.trim());
    } catch (error) {
    }
  }

  // Convert comma-separated strings to arrays
  const imagesArray = images && images.trim() 
    ? images.split(',').map(img => img.trim()).filter(img => img.length > 0)
    : null

  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) {
      return {
        message: 'Authentication required. Please log in.',
      }
    }

    // Update product in database
    const { error: productError } = await supabase
      .from('products')
      .update({
        title,
        description: description || null,
        image,
        hover_image: hover_image || null,
        price,
        ready: ready || false,
        category,
        material_details: material_details || null,
        care_details: care_details || null,
        deliver_details: deliver_details || null,
        images: imagesArray,
        slug,
      })
      .eq('id', productId)

    if (productError) {
      
      // Handle specific database errors
      if (productError.code === '23505') {
        if (productError.message.includes('title')) {
          return {
            errors: { title: ['A product with this title already exists.'] },
            message: 'Failed to update product.',
          }
        }
        if (productError.message.includes('slug')) {
          return {
            errors: { title: ['A product with this title already exists (slug conflict).'] },
            message: 'Failed to update product.',
          }
        }
      }
      
      return {
        message: 'Database Error: Failed to update product.',
      }
    }

    // Delete existing sizes and insert new ones
    await supabase
      .from('sizes')
      .delete()
      .eq('product_id', productId);

    // Insert new sizes if we have any
    if (sizesData.length > 0) {
      const sizesToInsert = sizesData.map(sizeItem => ({
        product_id: parseInt(productId),
        size: sizeItem.size,
        quantity: sizeItem.quantity || 0,
      }));

      const { error: sizesError } = await supabase
        .from('sizes')
        .insert(sizesToInsert);

      if (sizesError) {
        return {
          message: 'Product updated but failed to save sizes. Please try again.',
        }
      }
    }

  } catch (error) {
    return {
      message: 'Server Error: Failed to update product.',
    }
  }

  // Revalidate cache and redirect
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/view-products')
  redirect('/dashboard/view-products')
}

export async function deleteProduct(productId: string): Promise<{success: boolean, message: string}> {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) {
      return {
        success: false,
        message: 'Authentication required. Please log in.',
      }
    }

    // Delete associated sizes first (due to foreign key constraint)
    const { error: sizesError } = await supabase
      .from('sizes')
      .delete()
      .eq('product_id', productId);

    if (sizesError) {
      return {
        success: false,
        message: 'Failed to delete product sizes.',
      }
    }

    // Delete the product
    const { error: productError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (productError) {
      return {
        success: false,
        message: 'Failed to delete product.',
      }
    }

    // Revalidate cache
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/view-products')
    
    return {
      success: true,
      message: 'Product deleted successfully.',
    }

  } catch (error) {
    return {
      success: false,
      message: 'Server Error: Failed to delete product.',
    }
  }
} 