import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: texts, error } = await supabase
      .from("texts")
      .select("id, text")
      .order("id");

    if (error) {
      console.error("Error fetching texts:", error);
      return NextResponse.json(
        { error: "Failed to fetch texts" },
        { status: 500 },
      );
    }
    return NextResponse.json({
      texts: texts,
    });
  } catch (error) {
    console.error("Error in categories API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
} 