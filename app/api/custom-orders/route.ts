import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface CustomOrderRequest {
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone?: string;
  orderTitle: string;
  description: string;
  materials?: string;
  budgetMin?: string;
  budgetMax?: string;
  timelineWeeks?: string;
  specialRequests?: string;
  referenceImages: string[];
}

// POST - Create a new custom order
export async function POST(request: NextRequest) {
  try {
    const body: CustomOrderRequest = await request.json();

    // Validate required fields
    if (!body.customerFirstName || !body.customerLastName || !body.customerEmail || 
        !body.orderTitle || !body.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.customerEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Prepare data for database insertion
    const customOrderData = {
      customer_first_name: body.customerFirstName,
      customer_last_name: body.customerLastName,
      customer_email: body.customerEmail,
      customer_phone: body.customerPhone || null,
      order_title: body.orderTitle,
      description: body.description,
      materials: body.materials || null,
      budget_min: body.budgetMin ? parseFloat(body.budgetMin) : null,
      budget_max: body.budgetMax ? parseFloat(body.budgetMax) : null,
      timeline_weeks: body.timelineWeeks ? parseInt(body.timelineWeeks) : null,
      special_requests: body.specialRequests || null,
      reference_images: body.referenceImages.length > 0 ? body.referenceImages : null,
      status: 'submitted'
    };

    // Insert custom order into database
    const { data, error } = await supabase
      .from('custom_orders')
      .insert(customOrderData)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create custom order' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Custom order submitted successfully',
        customOrder: data
      },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Fetch custom orders (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication - only authenticated users can view custom orders
    const { data: user, error: authError } = await supabase.auth.getClaims();
    if (authError || !user?.claims) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const search = searchParams.get('search');

    let query = supabase
      .from('custom_orders')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`customer_first_name.ilike.%${search}%,customer_last_name.ilike.%${search}%,customer_email.ilike.%${search}%,order_title.ilike.%${search}%`);
    }

    // Apply pagination
    if (limit) {
      const limitNum = parseInt(limit);
      const offsetNum = offset ? parseInt(offset) : 0;
      query = query.range(offsetNum, offsetNum + limitNum - 1);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch custom orders' },
        { status: 500 }
      );
    }

    return NextResponse.json({ customOrders: data });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 