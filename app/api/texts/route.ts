import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: texts, error } = await supabase
      .from("texts")
      .select("id, text, english")
      .order("id");

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch texts" },
        { status: 500 },
      );
    }
    return NextResponse.json({
      texts: texts,
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { text, english } = body;

    // Validate required fields
    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // Create the new text
    const { data: newText, error } = await supabase
      .from("texts")
      .insert({
        text: text.trim(),
        english: english?.trim() || null
      })
      .select("id, text, english")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create text" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      text: newText,
      message: "Text created successfully"
    }, { status: 201 });

  } catch (_error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 