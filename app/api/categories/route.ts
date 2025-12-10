import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('name');

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    // Add "All" category
    const categoriesWithAll = [
      { id: "all", name: "All", slug: "all" },
      ...(categories || []).filter(cat => cat.slug !== "all")
    ];

    return NextResponse.json({
      categories: categoriesWithAll
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 