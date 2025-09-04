import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, FileText, Plus } from "lucide-react";
import Link from "next/link";

interface TextItem {
  id: number;
  text: string;
  english: string | null;
}

export default async function ViewTextsPage() {
  const supabase = await createClient();

  // Check authentication
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Fetch all texts
  const { data: texts, error: textsError } = await supabase
    .from('texts')
    .select('id, text, english')
    .order('id');

  if (textsError) {
    console.error('Error fetching texts:', textsError);
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Texts</h1>
              <p className="text-gray-600 mt-2">Manage your text content</p>
            </div>
            <Link href="/dashboard/create-text">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Text
              </Button>
            </Link>
          </div>
        </div>

        {/* Texts Grid */}
        {texts && texts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {texts.map((text: TextItem) => (
              <Card key={text.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Text #{text.id}
                      </h3>
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-xs text-gray-500 mb-1">Lithuanian</div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                          {text.text.length > 150 
                            ? `${text.text.substring(0, 150)}...` 
                            : text.text}
                        </p>
                      </div>
                      
                      {text.english && (
                        <div className="bg-blue-50 p-3 rounded-md">
                          <div className="text-xs text-blue-600 mb-1">English</div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                            {text.english.length > 150 
                              ? `${text.english.substring(0, 150)}...` 
                              : text.english}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/texts/${text.id}/edit`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No texts found</h3>
              <p className="text-sm">
                Start by creating your first text content.
              </p>
              <Link href="/dashboard/create-text">
                <Button className="mt-4">
                  Create Text
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
