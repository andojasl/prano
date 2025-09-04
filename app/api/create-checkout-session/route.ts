import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  size?: string
}

interface CheckoutRequest {
  orderId: number
  items: CartItem[]
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured')
      return NextResponse.json(
        { error: 'Payment system is not configured' },
        { status: 500 }
      )
    }

    const { orderId, items, customerInfo }: CheckoutRequest = await request.json()

    console.log('Checkout request received:', { 
      itemsCount: items?.length, 
      customerEmail: customerInfo?.email,
      items: items?.map(item => ({ 
        id: item.id, 
        name: item.name, 
        price: item.price, 
        image: item.image 
      }))
    })

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      )
    }

    // Helper function to validate and convert image URLs
    const getValidImageUrl = (imageUrl?: string): string[] | undefined => {
      if (!imageUrl) return undefined
      
      // If it's already a full URL (starts with http/https), use it
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return [imageUrl]
      }
      
      // If it's a relative path starting with "/", convert to absolute URL
      if (imageUrl.startsWith('/')) {
        const absoluteUrl = `${process.env.NEXT_PUBLIC_DOMAIN}${imageUrl}`
        return [absoluteUrl]
      }
      
      // If it doesn't start with / or http, it might be invalid, so don't include it
      return undefined
    }

    // Convert cart items to Stripe line items
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: getValidImageUrl(item.image),
          metadata: {
            productId: item.id,
            size: item.size || '',
          },
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amount in cents
      },
      quantity: item.quantity,
    }))

        // Update order with Stripe session ID before creating session
    const supabase = await createClient()
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout?order_id=${orderId}`,
      customer_email: customerInfo.email,
      shipping_address_collection: {
        allowed_countries: ['LT', 'LV', 'EE', 'DE', 'PL', 'FI', 'SE', 'NO', 'DK'],
      },
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 599, // €5.99 in cents
              currency: 'eur',
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1299, // €12.99 in cents
              currency: 'eur',
            },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 3,
              },
            },
          },
        },
      ],
      
      metadata: {
        orderId: orderId.toString(),
        customerFirstName: customerInfo.firstName,
        customerLastName: customerInfo.lastName,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone || '',
      },
    })

    // Update order with Stripe session ID
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        stripe_session_id: session.id,
        order_status: 'confirmed' // Order is confirmed when payment session is created
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Error updating order with session ID:', updateError)
      // Continue anyway, as the session was created successfully
    }

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url
    })

  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
} 