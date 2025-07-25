import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InfoIcon, Package, Users, TrendingUp, ShoppingCart, DollarSign, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Mock data for the dashboard
  const stats = {
    totalProducts: 45,
    totalOrders: 128,
    monthlyRevenue: 8450,
    conversionRate: 3.2
  };

  const recentOrders = [
    { id: "#001", customer: "Anna Smith", item: "Gold Ring", amount: 650, status: "completed" },
    { id: "#002", customer: "John Doe", item: "Silver Necklace", amount: 280, status: "processing" },
    { id: "#003", customer: "Maria Johnson", item: "Diamond Earrings", amount: 1200, status: "shipped" },
    { id: "#004", customer: "David Wilson", item: "Amber Bracelet", amount: 320, status: "pending" },
  ];

  const topProducts = [
    { name: "Gold Wedding Ring", sales: 24, revenue: 15600 },
    { name: "Silver Chain Necklace", sales: 18, revenue: 5040 },
    { name: "Amber Pendant", sales: 15, revenue: 4800 },
    { name: "Diamond Stud Earrings", sales: 12, revenue: 9600 },
  ];

  return (
    <div className="flex-1 w-full flex flex-col gap-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your jewelry business overview.</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <InfoIcon size="14" className="mr-1" />
          Live Data
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold">€{stats.monthlyRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold">{stats.conversionRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                <div>
                  <p className="font-medium">{order.id} - {order.customer}</p>
                  <p className="text-sm text-gray-600">{order.item}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">€{order.amount}</p>
                  <Badge 
                    variant={order.status === 'completed' ? 'default' : 'secondary'}
                    className={
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Products */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Top Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} sales</p>
                  </div>
                </div>
                <p className="font-semibold">€{product.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* User Info */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="text-xs font-mono overflow-auto">
            {JSON.stringify(data.claims, null, 2)}
          </pre>
        </div>
      </Card>
    </div>
  );
} 