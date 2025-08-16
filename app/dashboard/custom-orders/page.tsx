import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Sparkles, 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  CheckCircle, 
  Package, 
  Truck, 
  XCircle,
  Euro,
  Calendar,
  User,
  Mail,
  FileText,
  TrendingUp
} from "lucide-react";

interface CustomOrder {
  id: number;
  created_at: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  order_title: string;
  description: string;
  materials: string;
  budget_min: number;
  budget_max: number;
  timeline_weeks: number;
  reference_images: string[];
  special_requests: string;
  status: string;
  admin_notes: string;
  quoted_price: number;
  quoted_timeline_weeks: number;
}

interface CustomOrdersPageProps {
  searchParams: Promise<{ 
    status?: string; 
    search?: string; 
    page?: string; 
  }>;
}

export default async function CustomOrdersPage({ searchParams }: CustomOrdersPageProps) {
  const supabase = await createClient();

  // Check authentication
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const resolvedSearchParams = await searchParams;
  const statusFilter = resolvedSearchParams.status || '';
  const searchQuery = resolvedSearchParams.search || '';
  const page = parseInt(resolvedSearchParams.page || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  // Build query parameters
  const params = new URLSearchParams();
  if (statusFilter) params.append('status', statusFilter);
  if (searchQuery) params.append('search', searchQuery);
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());

  // Fetch custom orders directly from Supabase instead of API route
  let query = supabase
    .from('custom_orders')
    .select('*')
    .order('created_at', { ascending: false });

  // Apply filters
  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  if (searchQuery) {
    query = query.or(`customer_first_name.ilike.%${searchQuery}%,customer_last_name.ilike.%${searchQuery}%,customer_email.ilike.%${searchQuery}%,order_title.ilike.%${searchQuery}%`);
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data: customOrdersData, error: customOrdersError } = await query;

  let customOrders: CustomOrder[] = [];
  if (!customOrdersError && customOrdersData) {
    customOrders = customOrdersData;
  }

  // Get status statistics
  const { data: statusStats } = await supabase
    .from('custom_orders')
    .select('status')
    .then(({ data }) => {
      const stats = {
        submitted: 0,
        reviewing: 0,
        quoted: 0,
        approved: 0,
        in_progress: 0,
        completed: 0,
        cancelled: 0,
        total: data?.length || 0
      };
      
      data?.forEach(order => {
        if (stats.hasOwnProperty(order.status)) {
          stats[order.status as keyof typeof stats]++;
        }
      });
      
      return { data: stats };
    });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <FileText className="w-4 h-4" />;
      case 'reviewing':
        return <Eye className="w-4 h-4" />;
      case 'quoted':
        return <TrendingUp className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Package className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-amber-600" />
            <h1 className="text-3xl font-bold text-gray-900">Custom Orders</h1>
          </div>
          <p className="text-gray-600">
            Manage custom jewelry order requests from customers
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{statusStats?.submitted || 0}</div>
              <div className="text-sm text-gray-600">Submitted</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{statusStats?.reviewing || 0}</div>
              <div className="text-sm text-gray-600">Reviewing</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{statusStats?.quoted || 0}</div>
              <div className="text-sm text-gray-600">Quoted</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{statusStats?.approved || 0}</div>
              <div className="text-sm text-gray-600">Approved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{statusStats?.in_progress || 0}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{statusStats?.completed || 0}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{statusStats?.cancelled || 0}</div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{statusStats?.total || 0}</div>
              <div className="text-sm text-gray-600">Total</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <form method="GET" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="search"
                      name="search"
                      type="text"
                      placeholder="Customer name, email, or order title..."
                      defaultValue={searchQuery}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={statusFilter}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    <option value="submitted">Submitted</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="quoted">Quoted</option>
                    <option value="approved">Approved</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="w-full">
                    <Filter className="w-4 h-4 mr-2" />
                    Apply Filters
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Custom Orders List */}
        <div className="space-y-4">
          {customOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Custom Orders</h3>
                <p className="text-gray-600">
                  {searchQuery || statusFilter 
                    ? 'No custom orders match your current filters.' 
                    : 'No custom orders have been submitted yet.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            customOrders.map((customOrder) => (
              <Card key={customOrder.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {customOrder.order_title}
                        </h3>
                        <Badge className={getStatusColor(customOrder.status)} variant="secondary">
                          <span className="flex items-center gap-1">
                            {getStatusIcon(customOrder.status)}
                            {customOrder.status.charAt(0).toUpperCase() + customOrder.status.slice(1)}
                          </span>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{customOrder.customer_first_name} {customOrder.customer_last_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{customOrder.customer_email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Submitted {formatDate(customOrder.created_at)}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {customOrder.description}
                      </p>

                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Euro className="w-4 h-4" />
                          <span>Budget: {formatBudget(customOrder.budget_min, customOrder.budget_max)}</span>
                        </div>
                        {customOrder.timeline_weeks && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Timeline: {customOrder.timeline_weeks} weeks</span>
                          </div>
                        )}
                        {customOrder.materials && (
                          <div className="flex items-center gap-1">
                            <Sparkles className="w-4 h-4" />
                            <span>Materials: {customOrder.materials}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="ml-4">
                      <Link href={`/dashboard/custom-orders/${customOrder.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination would go here if needed */}
      </div>
    </div>
  );
} 