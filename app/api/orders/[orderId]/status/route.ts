import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { status } = await request.json()

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Await params before using
    const resolvedParams = await params;

    // Update order status
    const { data, error } = await supabase
      .from('orders')
      .update({ order_status: status })
      .eq('id', resolvedParams.orderId)
      .select('id, order_number, order_status')
      .single()

    if (error) {
      console.error('Error updating order status:', error)
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Order status updated successfully',
      order: data
    })

  } catch (error) {
    console.error('Error in order status update API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 