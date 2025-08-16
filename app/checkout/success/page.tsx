'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import useCartStore from '@/app/store/cartStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Package, Truck, Clock } from 'lucide-react'
import Image from 'next/image'

interface Order {
  id: number
  order_number: string
  customer_email: string
  customer_first_name: string
  customer_last_name: string
  subtotal: number
  shipping_cost: number
  tax_amount: number
  total_amount: number
  currency: string
  order_status: string
  payment_status: string
  created_at: string
  order_items: OrderItem[]
}

interface OrderItem {
  id: number
  product_name: string
  product_price: number
  product_image: string
  size_name: string
  quantity: number
  line_total: number
}

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCartStore()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id')
    const orderIdParam = searchParams.get('order_id')
    
    if (sessionIdParam) {
      setSessionId(sessionIdParam)
      // Clear the cart after successful payment
      clearCart()
    }
    
    if (orderIdParam) {
      setOrderId(orderIdParam)
      fetchOrder(orderIdParam)
    } else {
      setLoading(false)
    }
  }, [searchParams, clearCart])

  const fetchOrder = async (orderIdParam: string) => {
    try {
      const sessionIdParam = searchParams.get('session_id')
      const url = sessionIdParam 
        ? `/api/orders?id=${orderIdParam}&session_id=${sessionIdParam}`
        : `/api/orders?id=${orderIdParam}`
      
      const response = await fetch(url)
      if (response.ok) {
        const orderData = await response.json()
        setOrder(orderData)
      } else {
        console.error('Failed to fetch order')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Package className="w-5 h-5 text-blue-600" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-orange-600" />
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-orange-100 text-orange-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="text-center mb-8">
          <CardHeader className="pb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">
              Order Confirmed!
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <p className="text-lg text-gray-700 mb-2">
                Thank you for your order{order ? `, ${order.customer_first_name}` : ''}!
              </p>
              <p className="text-gray-600">
                Your payment has been processed successfully. You will receive a confirmation email shortly with tracking information.
              </p>
            </div>

            {order && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Order Number:</strong>
                </p>
                <p className="text-lg font-mono font-bold text-gray-900">
                  {order.order_number}
                </p>
                <div className="flex items-center justify-center mt-3 space-x-2">
                  {getStatusIcon(order.order_status)}
                  <Badge className={getStatusColor(order.order_status)}>
                    {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {order && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Order Items</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      {item.product_image && (
                        <div className="w-16 h-16 relative rounded-md overflow-hidden">
                          <Image
                            src={item.product_image}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                        {item.size_name && (
                          <p className="text-sm text-gray-600">Size: {item.size_name}</p>
                        )}
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€{item.line_total.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">€{item.product_price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>€{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>€{order.shipping_cost.toFixed(2)}</span>
                  </div>
                  {order.tax_amount > 0 && (
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>€{order.tax_amount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-3">
                    <span>Total</span>
                    <span>€{order.total_amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• You'll receive an email confirmation shortly</li>
                    <li>• We'll send tracking information when your order ships</li>
                    <li>• Expected delivery: 3-7 business days</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-8 text-center space-y-4">
          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/shop')}
              className="w-full sm:w-auto"
              size="lg"
            >
              Continue Shopping
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full sm:w-auto ml-0 sm:ml-4"
            >
              Back to Home
            </Button>
          </div>

          <div className="text-sm text-gray-500 pt-4">
            <p>
              Questions about your order? Contact us at{' '}
              <a href="mailto:support@pranasjewellery.com" className="text-blue-600 hover:underline">
                support@pranasjewellery.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 