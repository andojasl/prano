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
  
  available_sizes: z.string().optional(), // Will be converted to array
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
    available_sizes?: string[]
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
    available_sizes: formData.get('available_sizes'),
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
    available_sizes 
  } = validatedFields.data

  // Generate slug from title
  const slug = title.replace(/\s+/g, "-").toLowerCase();

  // Convert comma-separated strings to arrays
  const imagesArray = images && images.trim() 
    ? images.split(',').map(img => img.trim()).filter(img => img.length > 0)
    : null

  const sizesArray = available_sizes && available_sizes.trim()
    ? available_sizes.split(',').map(size => size.trim()).filter(size => size.length > 0)
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

    // Insert product into database
    const { error } = await supabase
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
        available_sizes: sizesArray,
      })

    if (error) {
      console.error('Database error:', error)
      
      // Handle specific database errors
      if (error.code === '23505') {
        if (error.message.includes('title')) {
          return {
            errors: { title: ['A product with this title already exists.'] },
            message: 'Failed to create product.',
          }
        }
        if (error.message.includes('slug')) {
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

  } catch (error) {
    console.error('Server error:', error)
    return {
      message: 'Server Error: Failed to create product.',
    }
  }

  // Revalidate cache and redirect
  revalidatePath('/dashboard')
  redirect('/dashboard')
} 