import { createClient } from '@/lib/supabase/server';
import { generateProductSlug } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();

    // First, add the slug column to the products table if it doesn't exist
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'products' AND column_name = 'slug'
          ) THEN
            ALTER TABLE products ADD COLUMN slug TEXT;
            CREATE UNIQUE INDEX IF NOT EXISTS products_slug_idx ON products(slug);
          END IF;
        END $$;
      `
    });

    if (alterError) {
      // If RPC doesn't work, we'll handle this differently
      // Most Supabase instances don't allow direct SQL execution via RPC for security
    }

    // Fetch all products that don't have slugs
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, title, slug')
      .or('slug.is.null,slug.eq.');

    if (fetchError) {
      throw new Error(`Failed to fetch products: ${fetchError.message}`);
    }

    if (!products || products.length === 0) {
      return NextResponse.json({ 
        message: 'No products need slug updates',
        updated: 0 
      });
    }

    // Generate slugs for products
    const updates = products.map(product => ({
      id: product.id,
      slug: generateProductSlug(product.title)
    }));

    // Check for duplicate slugs and make them unique
    const slugCounts = new Map<string, number>();
    const uniqueUpdates = updates.map(update => {
      let slug = update.slug;
      const count = slugCounts.get(slug) || 0;
      
      if (count > 0) {
        slug = `${slug}-${count}`;
      }
      
      slugCounts.set(update.slug, count + 1);
      
      return {
        ...update,
        slug
      };
    });

    // Update products with slugs
    const updatePromises = uniqueUpdates.map(update =>
      supabase
        .from('products')
        .update({ slug: update.slug })
        .eq('id', update.id)
    );

    const updateResults = await Promise.all(updatePromises);
    
    // Check for any errors
    const errors = updateResults.filter(result => result.error);
    if (errors.length > 0) {
      throw new Error('Some slug updates failed');
    }

    return NextResponse.json({ 
      message: 'Successfully added slugs to products',
      updated: uniqueUpdates.length,
      slugs: uniqueUpdates.map(u => ({ id: u.id, slug: u.slug }))
    });

  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to add product slugs' },
      { status: 500 }
    );
  }
} 