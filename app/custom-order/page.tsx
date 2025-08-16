'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Sparkles, 
  Upload, 
  Clock, 
  Euro, 
  User, 
  Mail, 
  Phone, 
  FileText,
  Gem,
  Calendar,
  MessageSquare,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import MultiImageUpload from '@/components/MultiImageUpload';

interface FormData {
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  orderTitle: string;
  description: string;
  materials: string;
  budgetMin: string;
  budgetMax: string;
  timelineWeeks: string;
  specialRequests: string;
  referenceImages: string[];
}

interface FormErrors {
  [key: string]: string;
}

export default function CustomOrderPage() {
  const [formData, setFormData] = useState<FormData>({
    customerFirstName: '',
    customerLastName: '',
    customerEmail: '',
    customerPhone: '',
    orderTitle: '',
    description: '',
    materials: '',
    budgetMin: '',
    budgetMax: '',
    timelineWeeks: '',
    specialRequests: '',
    referenceImages: []
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, referenceImages: images }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.customerFirstName.trim()) {
      newErrors.customerFirstName = 'First name is required';
    }
    if (!formData.customerLastName.trim()) {
      newErrors.customerLastName = 'Last name is required';
    }
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }
    if (!formData.orderTitle.trim()) {
      newErrors.orderTitle = 'Order title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Budget validation
    if (formData.budgetMin && formData.budgetMax) {
      const min = parseFloat(formData.budgetMin);
      const max = parseFloat(formData.budgetMax);
      if (min > max) {
        newErrors.budgetMax = 'Maximum budget must be greater than minimum';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/custom-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        alert('Failed to submit custom order: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting custom order:', error);
      alert('An error occurred while submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Custom Order Submitted Successfully!
              </h1>
              <p className="text-gray-600 mb-6">
                Thank you for your custom order request. We've received your submission and our team will review it shortly. 
                You can expect to hear back from us within 2-3 business days with a quote and timeline.
              </p>
              <div className="space-y-3">
                <Link href="/shop">
                  <Button className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    customerFirstName: '',
                    customerLastName: '',
                    customerEmail: '',
                    customerPhone: '',
                    orderTitle: '',
                    description: '',
                    materials: '',
                    budgetMin: '',
                    budgetMax: '',
                    timelineWeeks: '',
                    specialRequests: '',
                    referenceImages: []
                  });
                }}>
                  Submit Another Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Custom Order Request</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have a unique vision for your perfect piece of jewelry? Submit a custom order request and our artisans 
            will work with you to bring your dream design to life.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.customerFirstName}
                    onChange={(e) => handleInputChange('customerFirstName', e.target.value)}
                    className={errors.customerFirstName ? 'border-red-500' : ''}
                  />
                  {errors.customerFirstName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.customerFirstName}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.customerLastName}
                    onChange={(e) => handleInputChange('customerLastName', e.target.value)}
                    className={errors.customerLastName ? 'border-red-500' : ''}
                  />
                  {errors.customerLastName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.customerLastName}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  className={errors.customerEmail ? 'border-red-500' : ''}
                />
                {errors.customerEmail && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.customerEmail}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gem className="w-5 h-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="orderTitle">Order Title *</Label>
                <Input
                  id="orderTitle"
                  placeholder="e.g., Custom Engagement Ring, Personalized Necklace"
                  value={formData.orderTitle}
                  onChange={(e) => handleInputChange('orderTitle', e.target.value)}
                  className={errors.orderTitle ? 'border-red-500' : ''}
                />
                {errors.orderTitle && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.orderTitle}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="description">Detailed Description *</Label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Please describe your vision in detail. Include size, style, design elements, and any specific requirements..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="materials">Preferred Materials</Label>
                <Input
                  id="materials"
                  placeholder="e.g., 14k Gold, Sterling Silver, Diamonds, Emeralds"
                  value={formData.materials}
                  onChange={(e) => handleInputChange('materials', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Budget and Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Euro className="w-5 h-5" />
                Budget & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budgetMin">Minimum Budget (€)</Label>
                  <Input
                    id="budgetMin"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="500"
                    value={formData.budgetMin}
                    onChange={(e) => handleInputChange('budgetMin', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="budgetMax">Maximum Budget (€)</Label>
                  <Input
                    id="budgetMax"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="2000"
                    value={formData.budgetMax}
                    onChange={(e) => handleInputChange('budgetMax', e.target.value)}
                    className={errors.budgetMax ? 'border-red-500' : ''}
                  />
                  {errors.budgetMax && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.budgetMax}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="timeline">Desired Timeline (Weeks)</Label>
                <Input
                  id="timeline"
                  type="number"
                  min="1"
                  placeholder="4-8 weeks typical"
                  value={formData.timelineWeeks}
                  onChange={(e) => handleInputChange('timelineWeeks', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Reference Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Reference Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Upload images that inspire your design or show similar pieces you like. This helps us understand your vision better.
              </p>
                             <MultiImageUpload
                 currentImages={formData.referenceImages}
                 onImagesChange={handleImagesChange}
                 label="Reference Images"
                 maxImages={5}
               />
            </CardContent>
          </Card>

          {/* Special Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Special Requests & Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                rows={3}
                placeholder="Any additional requests, concerns, or information you'd like to share..."
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full md:w-auto px-8"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Custom Order Request'}
            </Button>
          </div>
        </form>

        {/* Information Section */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>We'll review your request within 2-3 business days</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>You'll receive a detailed quote and timeline via email</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>Our team may contact you to discuss details and refine the design</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Once approved, we'll begin crafting your unique piece</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 