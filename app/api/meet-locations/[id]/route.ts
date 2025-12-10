import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Invalid meet location ID' },
        { status: 400 }
      );
    }

    // Delete the meet location
    const { error: deleteError } = await supabase
      .from('meet_locations')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete meet location' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Meet location deleted successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Invalid meet location ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, city, location, link, date } = body;

    // Validate required fields
    if (!title || !city || !location || !date) {
      return NextResponse.json(
        { error: 'Title, city, location, and date are required' },
        { status: 400 }
      );
    }

    // Update the meet location
    const { data, error: updateError } = await supabase
      .from('meet_locations')
      .update({
        title,
        city,
        location,
        "Link": link || null,
        "Date": date,
      })
      .eq('id', id)
      .select();

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update meet location' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      data: data[0]
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}