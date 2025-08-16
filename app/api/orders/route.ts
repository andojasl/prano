import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  size?: string
}

interface CreateOrderRequest {
  items: CartItem[]
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
}

interface OrderResponse {
  orderId: number
  orderNumber: string
  totalAmount: number
}

// Create a new order (before payment)
export async function POST(request: NextRequest) {
  try {
    const { items, customerInfo }: CreateOrderRequest = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      )
    }

    if (!customerInfo.email || !customerInfo.firstName || !customerInfo.lastName) {
      return NextResponse.json(
        { error: 'Customer information is incomplete' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const serviceSupabase = createServiceClient() // For secure order creation

    // Generate order number in application code
    const generateOrderNumber = () => {
      const prefix = 'PRN'
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '') // YYYYMMDD
      const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
      return `${prefix}${timestamp}${random}`
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shippingCost = 5.99 // Fixed shipping for now
    const totalAmount = subtotal + shippingCost

    // Create the order with generated order number using service client (bypasses RLS)
    const { data: orderData, error: orderError } = await serviceSupabase
      .from('orders')
      .insert({
        order_number: generateOrderNumber(),
        customer_email: customerInfo.email,
        customer_first_name: customerInfo.firstName,
        customer_last_name: customerInfo.lastName,
        customer_phone: customerInfo.phone || null,
        subtotal,
        shipping_cost: shippingCost,
        tax_amount: 0, // Will be calculated by Stripe
        total_amount: totalAmount,
        currency: 'EUR',
        order_status: 'pending',
        payment_status: 'pending'
      })
      .select('id, order_number, total_amount')
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    // Create order items
    const orderItems = items.map(item => ({
      order_id: orderData.id,
      product_id: item.id,
      product_name: item.name,
      product_price: item.price,
      product_image: item.image || null,
      size_name: item.size || null,
      quantity: item.quantity,
      line_total: item.price * item.quantity
    }))

    const { error: itemsError } = await serviceSupabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      
      // Rollback: delete the order if items creation failed
      await serviceSupabase.from('orders').delete().eq('id', orderData.id)
      
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      )
    }

    const response: OrderResponse = {
      orderId: orderData.id,
      orderNumber: orderData.order_number,
      totalAmount: orderData.total_amount
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error in orders API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get order by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    const orderNumber = searchParams.get('orderNumber')
    const sessionId = searchParams.get('session_id') // For anonymous access validation

    if (!orderId && !orderNumber) {
      return NextResponse.json(
        { error: 'Order ID or order number is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Check if user is authenticated (admin access)
    const { data: { user } } = await supabase.auth.getUser()
    
    // For anonymous users, require session_id for security
    if (!user && !sessionId) {
      return NextResponse.json(
        { error: 'Session ID required for order access' },
        { status: 401 }
      )
    }

    // Use service client for admin access or when validating session_id
    const clientToUse = user ? supabase : createServiceClient()

    // Build query based on available parameters
    let query = clientToUse
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_price,
          product_image,
          size_name,
          quantity,
          line_total
        )
      `)

    if (orderId) {
      query = query.eq('id', orderId)
    } else if (orderNumber) {
      query = query.eq('order_number', orderNumber)
    }

    // For anonymous users, also validate session_id matches
    if (!user && sessionId) {
      query = query.eq('stripe_session_id', sessionId)
    }

    const { data: order, error } = await query.single()

    if (error) {
      console.error('Error fetching order:', error)
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)

  } catch (error) {
    console.error('Error in orders GET API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 