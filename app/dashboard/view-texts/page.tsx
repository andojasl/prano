import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, FileText } from "lucide-react";

interface TextItem {
  id: number;
  text: string;
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
    .select('id, text')
    .order('id');

  if (textsError) {
    console.error('Error fetching texts:', textsError);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">View Texts</h1>
          <p className="text-gray-600 mt-2">Manage your text content</p>
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
                    
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                        {text.text.length > 200 
                          ? `${text.text.substring(0, 200)}...` 
                          : text.text}
                      </p>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
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
              <Button className="mt-4">
                Create Text
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
