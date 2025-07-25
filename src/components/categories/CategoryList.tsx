import { createClient } from '@/utils/supabase/server';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryListProps {
  showAll?: boolean;
  onCategorySelect?: (categoryId: string) => void;
}

export async function CategoryList({ showAll = true }: CategoryListProps) {
  const supabase = await createClient();
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return <div>Error loading categories</div>;
  }

  const displayCategories = showAll 
    ? [{ id: "all", name: "All", slug: "all" }, ...(categories || [])]
    : categories || [];

  return (
    <div className="flex flex-wrap gap-4">
      {displayCategories.map((category) => (
        <button
          key={category.id}
          className="px-6 py-3 font-headline rounded-lg text-sm tracking-wider border border-black hover:bg-black hover:text-white transition-all duration-300 first:bg-black first:text-white"
        >
          {category.name}
        </button>
      ))}
    </div>
  );
} 