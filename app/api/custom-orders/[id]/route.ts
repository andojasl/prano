import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Fetch single custom order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: user, error: authError } = await supabase.auth.getClaims();
    if (authError || !user?.claims) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const { data, error } = await supabase
      .from('custom_orders')
      .select('*')
      .eq('id', resolvedParams.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Custom order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ customOrder: data });

  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update custom order
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: user, error: authError } = await supabase.auth.getClaims();
    if (authError || !user?.claims) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const body = await request.json();

    // Prepare update data
    const updateData: Record<string, unknown> = {};
    
    if (body.status) {
      updateData.status = body.status;
      
      // Set timestamps based on status
      const now = new Date().toISOString();
      switch (body.status) {
        case 'reviewing':
          updateData.reviewed_at = now;
          break;
        case 'quoted':
          updateData.quoted_at = now;
          break;
        case 'approved':
          updateData.approved_at = now;
          break;
        case 'completed':
          updateData.completed_at = now;
          break;
      }
    }

    if (body.adminNotes !== undefined) {
      updateData.admin_notes = body.adminNotes;
    }

    if (body.quotedPrice !== undefined) {
      updateData.quoted_price = body.quotedPrice ? parseFloat(body.quotedPrice) : null;
    }

    if (body.quotedTimelineWeeks !== undefined) {
      updateData.quoted_timeline_weeks = body.quotedTimelineWeeks ? parseInt(body.quotedTimelineWeeks) : null;
    }

    const { data, error } = await supabase
      .from('custom_orders')
      .update(updateData)
      .eq('id', resolvedParams.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update custom order' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Custom order updated successfully',
      customOrder: data 
    });

  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete custom order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: user, error: authError } = await supabase.auth.getClaims();
    if (authError || !user?.claims) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const { error } = await supabase
      .from('custom_orders')
      .delete()
      .eq('id', resolvedParams.id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete custom order' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Custom order deleted successfully' 
    });

  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 