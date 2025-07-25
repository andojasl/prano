import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');

    // Base query for products
    let query = supabase
      .from('products')
      .select(`
        id, 
        image, 
        hover_image, 
        title, 
        slug, 
        price, 
        category, 
        description, 
        ready, 
        available_sizes, 
        images,
        categories!inner(slug)
      `)
      .order('title');

    // If category filter is specified and not 'all', filter by category
    if (categorySlug && categorySlug !== 'all') {
      // First get the category ID
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();

      if (categoryError || !categoryData) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }

      // Filter products by category ID
      query = query.eq('category', categoryData.id);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      products: products || [],
      category: categorySlug
    });

  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 