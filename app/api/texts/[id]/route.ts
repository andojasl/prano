import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Get individual text by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const supabase = await createClient();
    const textId = resolvedParams.id;

    // Validate ID
    if (!textId || isNaN(Number(textId))) {
      return NextResponse.json(
        { error: "Valid text ID is required" },
        { status: 400 }
      );
    }

    const { data: text, error } = await supabase
      .from("texts")
      .select("id, text, english")
      .eq("id", textId)
      .single();

    if (error) {
      console.error("Error fetching text:", error);
      return NextResponse.json(
        { error: "Text not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      text: text,
    });
  } catch (error) {
    console.error("Error in text GET API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update text by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const supabase = await createClient();
    const textId = resolvedParams.id;

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Validate ID
    if (!textId || isNaN(Number(textId))) {
      return NextResponse.json(
        { error: "Valid text ID is required" },
        { status: 400 }
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

    // Update the text
    const { data: updatedText, error } = await supabase
      .from("texts")
      .update({
        text: text.trim(),
        english: english?.trim() || null
      })
      .eq("id", textId)
      .select("id, text, english")
      .single();

    if (error) {
      console.error("Error updating text:", error);
      return NextResponse.json(
        { error: "Failed to update text" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      text: updatedText,
      message: "Text updated successfully"
    });

  } catch (error) {
    console.error("Error in text PUT API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete text by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const supabase = await createClient();
    const textId = resolvedParams.id;

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Validate ID
    if (!textId || isNaN(Number(textId))) {
      return NextResponse.json(
        { error: "Valid text ID is required" },
        { status: 400 }
      );
    }

    // Delete the text
    const { error } = await supabase
      .from("texts")
      .delete()
      .eq("id", textId);

    if (error) {
      console.error("Error deleting text:", error);
      return NextResponse.json(
        { error: "Failed to delete text" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Text deleted successfully"
    });

  } catch (error) {
    console.error("Error in text DELETE API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

