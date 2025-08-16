import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('Missing stripe-signature header')
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    console.log('Stripe webhook event:', event.type)

    const supabase = await createClient()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        console.log('Checkout session completed:', session.id)

        const orderId = session.metadata?.orderId
        if (!orderId) {
          console.error('No orderId found in session metadata')
          break
        }

        // Update order with payment success and shipping info
        const updateData: any = {
          payment_status: 'paid',
          order_status: 'processing',
          stripe_payment_intent_id: session.payment_intent,
        }

        // Extract shipping information if available
        const shipping = (session as any).shipping_details
        if (shipping) {
          updateData.shipping_name = shipping.name
          updateData.shipping_phone = shipping.phone
          
          if (shipping.address) {
            const addr = shipping.address
            updateData.shipping_address = JSON.stringify({
              line1: addr.line1,
              line2: addr.line2,
              city: addr.city,
              state: addr.state,
              postal_code: addr.postal_code,
              country: addr.country
            })
          }
        }

        // Update tax amount from Stripe if available
        if (session.total_details?.amount_tax) {
          updateData.tax_amount = session.total_details.amount_tax / 100 // Convert from cents
        }

        // Update total amount from Stripe
        if (session.amount_total) {
          updateData.total_amount = session.amount_total / 100 // Convert from cents
        }

        const { error: updateError } = await supabase
          .from('orders')
          .update(updateData)
          .eq('id', parseInt(orderId))

        if (updateError) {
          console.error('Error updating order after payment:', updateError)
        } else {
          console.log('Order updated successfully after payment:', orderId)
        }

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        console.log('Payment failed:', paymentIntent.id)

        // Find order by payment intent ID and update status
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            payment_status: 'failed',
            order_status: 'cancelled'
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        if (updateError) {
          console.error('Error updating order after payment failure:', updateError)
        }

        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object
        console.log('Checkout session expired:', session.id)

        const orderId = session.metadata?.orderId
        if (orderId) {
          const { error: updateError } = await supabase
            .from('orders')
            .update({
              payment_status: 'failed',
              order_status: 'cancelled'
            })
            .eq('id', parseInt(orderId))

          if (updateError) {
            console.error('Error updating order after session expiry:', updateError)
          }
        }

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
} 