import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { InlineStatusManager } from "./_components/InlineStatusManager";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  Eye, 
  Search,
  Calendar,
  Euro,
  User,
  Mail
} from "lucide-react";

interface Order {
  id: number;
  order_number: string;
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  order_status: string;
  payment_status: string;
  created_at: string;
  stripe_session_id: string;
  order_items: {
    id: number;
    product_name: string;
    quantity: number;
    product_price: number;
    line_total: number;
    size_name: string;
  }[];
}

export default async function ViewOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}) {
  const supabase = await createClient();

  // Check authentication
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Await searchParams before using
  const resolvedSearchParams = await searchParams;

  // Build query with filters
  let query = supabase
    .from('orders')
    .select(`
      id,
      order_number,
      customer_email,
      customer_first_name,
      customer_last_name,
      customer_phone,
      subtotal,
      shipping_cost,
      tax_amount,
      total_amount,
      currency,
      order_status,
      payment_status,
      created_at,
      stripe_session_id,
      order_items (
        id,
        product_name,
        quantity,
        product_price,
        line_total,
        size_name
      )
    `)
    .order('created_at', { ascending: false });

  // Apply status filter
  if (resolvedSearchParams.status && resolvedSearchParams.status !== 'all') {
    query = query.eq('order_status', resolvedSearchParams.status);
  }

  // Apply search filter
  if (resolvedSearchParams.search) {
    query = query.or(`order_number.ilike.%${resolvedSearchParams.search}%,customer_email.ilike.%${resolvedSearchParams.search}%,customer_first_name.ilike.%${resolvedSearchParams.search}%,customer_last_name.ilike.%${resolvedSearchParams.search}%`);
  }

  const { data: orders, error: ordersError } = await query;

  if (ordersError) {
    console.error('Error fetching orders:', ordersError);
  }



  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const orderStats = {
    total: orders?.length || 0,
    pending: orders?.filter(o => o.order_status === 'pending').length || 0,
    processing: orders?.filter(o => o.order_status === 'processing').length || 0,
    shipped: orders?.filter(o => o.order_status === 'shipped').length || 0,
    delivered: orders?.filter(o => o.order_status === 'delivered').length || 0,
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{orderStats.total}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Processing</p>
                  <p className="text-2xl font-bold text-purple-600">{orderStats.processing}</p>
                </div>
                <Package className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Shipped</p>
                  <p className="text-2xl font-bold text-orange-600">{orderStats.shipped}</p>
                </div>
                <Truck className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold text-green-600">{orderStats.delivered}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search by order number, customer name, or email..."
                    className="pl-10"
                    defaultValue={resolvedSearchParams.search}
                    name="search"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex gap-2 flex-wrap">
                <Link href="/dashboard/orders?status=all">
                  <Button 
                    variant={!resolvedSearchParams.status || resolvedSearchParams.status === 'all' ? 'default' : 'outline'}
                    size="sm"
                  >
                    All
                  </Button>
                </Link>
                <Link href="/dashboard/orders?status=pending">
                  <Button 
                    variant={resolvedSearchParams.status === 'pending' ? 'default' : 'outline'}
                    size="sm"
                  >
                    Pending
                  </Button>
                </Link>
                <Link href="/dashboard/orders?status=processing">
                  <Button 
                    variant={resolvedSearchParams.status === 'processing' ? 'default' : 'outline'}
                    size="sm"
                  >
                    Processing
                  </Button>
                </Link>
                <Link href="/dashboard/orders?status=shipped">
                  <Button 
                    variant={resolvedSearchParams.status === 'shipped' ? 'default' : 'outline'}
                    size="sm"
                  >
                    Shipped
                  </Button>
                </Link>
                <Link href="/dashboard/orders?status=delivered">
                  <Button 
                    variant={resolvedSearchParams.status === 'delivered' ? 'default' : 'outline'}
                    size="sm"
                  >
                    Delivered
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {orders && orders.length > 0 ? (
            orders.map((order: Order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Order Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {order.order_number}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(order.created_at)}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <InlineStatusManager 
                            orderId={order.id} 
                            currentStatus={order.order_status}
                          />
                          <Badge className={getPaymentStatusColor(order.payment_status)}>
                            {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4" />
                          {order.customer_first_name} {order.customer_last_name}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          {order.customer_email}
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Items ({order.order_items.length})</p>
                      <div className="space-y-1">
                        {order.order_items.slice(0, 2).map((item) => (
                          <div key={item.id} className="text-sm text-gray-600">
                            {item.quantity}x {item.product_name}
                            {item.size_name && (
                              <span className="text-gray-400"> ({item.size_name})</span>
                            )}
                          </div>
                        ))}
                        {order.order_items.length > 2 && (
                          <div className="text-sm text-gray-400">
                            +{order.order_items.length - 2} more items
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Total & Actions */}
                    <div className="flex flex-col justify-between">
                      <div className="text-right mb-4">
                        <div className="flex items-center justify-end gap-1 text-lg font-semibold">
                          <Euro className="w-4 h-4" />
                          {order.total_amount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.order_items.reduce((sum, item) => sum + item.quantity, 0)} items
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600">
                  {resolvedSearchParams.search || resolvedSearchParams.status !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Orders will appear here when customers place them.'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 