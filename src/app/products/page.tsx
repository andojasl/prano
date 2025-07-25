
import { createClient } from '@/utils/supabase/server';

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase.from("products").select();
  return <pre>{JSON.stringify(products, null, 2)}</pre>;
}