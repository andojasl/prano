import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Sparkles,
  FileText,
  MessageSquare,
  Eye,
  TrendingUp,
  CheckCircle,
  Package,
  XCircle
} from "lucide-react";
import { CustomOrderStatusManager } from "./_components/CustomOrderStatusManager";
import { CustomOrderQuoteManager } from "./_components/CustomOrderQuoteManager";
import { DeleteCustomOrderButton } from "./_components/DeleteCustomOrderButton";
import { InteractiveImage } from "./_components/InteractiveImage";



export default async function CustomOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();

  // Check authentication
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Await params before using
  const resolvedParams = await params;

  // Fetch custom order details
  const { data: customOrder, error: orderError } = await supabase
    .from('custom_orders')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (orderError || !customOrder) {
    notFound();
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <FileText className="w-5 h-5" />;
      case 'reviewing':
        return <Eye className="w-5 h-5" />;
      case 'quoted':
        return <TrendingUp className="w-5 h-5" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5" />;
      case 'in_progress':
        return <Package className="w-5 h-5" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800';
      case 'quoted':
        return 'bg-purple-100 text-purple-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatBudget = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `€${min.toFixed(0)} - €${max.toFixed(0)}`;
    if (min) return `€${min.toFixed(0)}+`;
    if (max) return `Up to €${max.toFixed(0)}`;
    return 'Not specified';
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard/custom-requests">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Custom Requests
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{customOrder.order_title}</h1>
              <div className="flex items-center gap-2 text-gray-600 mt-2">
                <Calendar className="w-4 h-4" />
                <span>Submitted on {formatDate(customOrder.created_at)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(customOrder.status)} variant="secondary">
                <span className="flex items-center gap-2">
                  {getStatusIcon(customOrder.status)}
                  {customOrder.status.charAt(0).toUpperCase() + customOrder.status.slice(1)}
                </span>
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Order Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{customOrder.description}</p>
                {customOrder.materials && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span className="font-medium text-amber-900">Preferred Materials</span>
                    </div>
                    <p className="text-amber-800">{customOrder.materials}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="font-medium">
                      {customOrder.customer_first_name} {customOrder.customer_last_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <a 
                      href={`mailto:${customOrder.customer_email}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {customOrder.customer_email}
                    </a>
                  </div>
                  {customOrder.customer_phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <a 
                        href={`tel:${customOrder.customer_phone}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {customOrder.customer_phone}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reference Images */}
            {customOrder.reference_images && customOrder.reference_images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Reference Images ({customOrder.reference_images.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {customOrder.reference_images.map((image: string, index: number) => (
                      <InteractiveImage
                        key={index}
                        src={image}
                        alt={`Reference image ${index + 1}`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Special Requests */}
            {customOrder.special_requests && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Special Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{customOrder.special_requests}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget Range</span>
                    <span className="font-medium">
                      {formatBudget(customOrder.budget_min, customOrder.budget_max)}
                    </span>
                  </div>
                  {customOrder.timeline_weeks && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Desired Timeline</span>
                      <span className="font-medium">{customOrder.timeline_weeks} weeks</span>
                    </div>
                  )}
                  {customOrder.quoted_price && (
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-gray-600">Quoted Price</span>
                      <span className="font-bold text-lg">€{customOrder.quoted_price.toFixed(2)}</span>
                    </div>
                  )}
                  {customOrder.quoted_timeline_weeks && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quoted Timeline</span>
                      <span className="font-medium">{customOrder.quoted_timeline_weeks} weeks</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Management */}
            <Card>
              <CardHeader>
                <CardTitle>Status Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CustomOrderStatusManager 
                  customOrderId={customOrder.id} 
                  currentStatus={customOrder.status} 
                />
              </CardContent>
            </Card>

            {/* Quote Management */}
            <Card>
              <CardHeader>
                <CardTitle>Quote Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomOrderQuoteManager 
                  customOrderId={customOrder.id}
                  currentQuotedPrice={customOrder.quoted_price}
                  currentQuotedTimeline={customOrder.quoted_timeline_weeks}
                  currentAdminNotes={customOrder.admin_notes}
                />
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Order Submitted</p>
                      <p className="text-sm text-gray-600">{formatDate(customOrder.created_at)}</p>
                    </div>
                  </div>

                  {customOrder.reviewed_at && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Eye className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">Review Started</p>
                        <p className="text-sm text-gray-600">{formatDate(customOrder.reviewed_at)}</p>
                      </div>
                    </div>
                  )}

                  {customOrder.quoted_at && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Quote Provided</p>
                        <p className="text-sm text-gray-600">{formatDate(customOrder.quoted_at)}</p>
                      </div>
                    </div>
                  )}

                  {customOrder.approved_at && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Order Approved</p>
                        <p className="text-sm text-gray-600">{formatDate(customOrder.approved_at)}</p>
                      </div>
                    </div>
                  )}

                  {customOrder.completed_at && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Order Completed</p>
                        <p className="text-sm text-gray-600">{formatDate(customOrder.completed_at)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Admin Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-t pt-4">
                  <DeleteCustomOrderButton 
                    customOrderId={customOrder.id} 
                    orderTitle={customOrder.order_title} 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 