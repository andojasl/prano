import { createClient } from '@/utils/supabase/server';

// This is a Server Component (no 'use client' directive)
export default async function CategoriesPage() {
  const supabase = await createClient();
  
  // Fetch categories from Supabase
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return <div>Error loading categories</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-headline mb-8">Categories</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories?.map((category) => (
          <div 
            key={category.id} 
            className="border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-headline mb-2">{category.name}</h2>
            <p className="text-gray-500 text-sm">/{category.slug}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 