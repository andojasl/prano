import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";


export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const linkComponent = (href: string, text: string) => {
    return (
      <Link href={href} className="w-full">
        <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors">{text}</div>
      </Link>
    )
  } 

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col gap-4">
        <div className="flex w-full flex-row justify-between gap-4 border-b border-gray-200 pb-6 pt-2">
      
          {linkComponent("/dashboard/create-product", "Create a product")}
          {linkComponent("/dashboard/create-product", "Edit existing products")}
        </div>
        <div className="flex w-full flex-row justify-between gap-4 border-b border-gray-200 pb-6 pt-2">
          {linkComponent("/dashboard/create-product", "Create a text")}
          {linkComponent("/dashboard/create-product", "Edit existing texts")}
        </div>
        <div className="flex w-full flex-row justify-between gap-4 border-b border-gray-200 pb-6 pt-2 ">
          {linkComponent("/dashboard/create-product", "Create a category")}
          {linkComponent("/dashboard/create-product", "Edit existing categories")}
        </div>
      </div>
    </div>
  );
} 