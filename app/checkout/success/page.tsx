'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import useCartStore from '@/app/store/cartStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCartStore()
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id')
    if (sessionIdParam) {
      setSessionId(sessionIdParam)
      // Clear the cart after successful payment
      clearCart()
    }
  }, [searchParams, clearCart])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="text-center">
          <CardHeader className="pb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">
              Payment Successful!
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <p className="text-lg text-gray-700 mb-2">
                Thank you for your order!
              </p>
              <p className="text-gray-600">
                Your payment has been processed successfully. You will receive a confirmation email shortly with your order details and tracking information.
              </p>
            </div>

            {sessionId && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Order Reference:</strong>
                </p>
                <p className="text-sm font-mono bg-white p-2 rounded border mt-1">
                  {sessionId}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/shop')}
                className="w-full"
                size="lg"
              >
                Continue Shopping
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => router.push('/')}
                className="w-full"
              >
                Back to Home
              </Button>
            </div>

            <div className="text-sm text-gray-500 border-t pt-4">
              <p>
                If you have any questions about your order, please contact us at{' '}
                <a href="mailto:support@pranasjewellery.com" className="text-blue-600 hover:underline">
                  support@pranasjewellery.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 