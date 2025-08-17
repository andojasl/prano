'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useCartStore from '@/app/store/cartStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, isHydrated } = useCartStore()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Lithuania'
  })

  useEffect(() => {
    // Wait for hydration to complete before making routing decisions
    if (isHydrated) {
      setLoading(false)
      // Only redirect to cart if the cart is empty AND the store is hydrated
      if (items.length === 0) {
        router.push('/cart')
      }
    }
  }, [items, router, isHydrated])

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    const requiredFields: (keyof CustomerInfo)[] = [
      'firstName', 'lastName', 'email'
    ]

    for (const field of requiredFields) {
      if (!customerInfo[field].trim()) {
        alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return false
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerInfo.email)) {
      alert('Please enter a valid email address')
      return false
    }

    return true
  }

  const handleStripeCheckout = async () => {
    if (!validateForm()) return

    setProcessing(true)
    
    try {
      // Step 1: Create order in database
      console.log('Creating order...')
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerInfo,
        }),
      })

      if (!orderResponse.ok) {
        const orderError = await orderResponse.json()
        throw new Error(orderError.error || 'Failed to create order')
      }

      const { orderId, orderNumber } = await orderResponse.json()
      console.log('Order created:', { orderId, orderNumber })

      // Step 2: Create Stripe checkout session with order reference
      console.log('Creating Stripe checkout session...')
      const checkoutResponse = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          items,
          customerInfo,
        }),
      })

      if (!checkoutResponse.ok) {
        const checkoutError = await checkoutResponse.json()
        throw new Error(checkoutError.error || 'Failed to create checkout session')
      }

      const { url, error } = await checkoutResponse.json()

      if (error) {
        throw new Error(error)
      }

      if (url) {
        console.log('Redirecting to Stripe checkout...')
        // Redirect to Stripe Checkout
        window.location.href = url
      }
      
    } catch (error) {
      console.error('Error in checkout process:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`There was an error processing your checkout: ${errorMessage}. Please try again.`)
    } finally {
      setProcessing(false)
    }
  }

  // Show loading state until cart is hydrated
  if (loading || !isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading checkout...</p>
        </div>
      </div>
    )
  }

  const shipping = 5.99
  const estimatedTotal = totalPrice + shipping

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-muted-foreground">Review your order and proceed to payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size || 'default'}`} className="flex items-center space-x-4">
                      {item.image && (
                        <div className="w-16 h-16 relative rounded-md overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        {item.size && (
                          <Badge variant="secondary" className="text-xs">
                            Size: {item.size}
                          </Badge>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>€{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Shipping (estimated)</span>
                      <span>€{shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Estimated Total</span>
                      <span>€{estimatedTotal.toFixed(2)}+</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Information */}
          <div className="lg:order-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Shipping and billing details will be collected securely during payment
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={customerInfo.firstName}
                      onChange={(e) => handleCustomerInfoChange('firstName', e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={customerInfo.lastName}
                      onChange={(e) => handleCustomerInfoChange('lastName', e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                      placeholder="Enter email address"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      You&apos;ll receive order confirmation and tracking updates here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Secure payment powered by Stripe
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Your payment information is encrypted and secure</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>✓ Credit & Debit Cards</div>
                    <div>✓ Apple Pay & Google Pay</div>
                    <div>✓ Bank Transfers</div>
                    <div>✓ EU Consumer Protection</div>
                  </div>

                  <Button 
                    onClick={handleStripeCheckout}
                    disabled={processing || items.length === 0}
                    className="w-full h-12 text-lg"
                    size="lg"
                  >
                    {processing ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      `Proceed to Payment - €${estimatedTotal.toFixed(2)}+`
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By proceeding, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

