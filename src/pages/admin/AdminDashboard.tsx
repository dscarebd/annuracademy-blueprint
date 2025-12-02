import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  status: string;
  total_amount: number;
  items: Array<{ title: string }>;
  created_at: string;
}

interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  totalRevenue: number;
  confirmedRevenue: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "পেন্ডিং":
      return "bg-yellow-100 text-yellow-800";
    case "কনফার্মড":
      return "bg-blue-100 text-blue-800";
    case "ক্যান্সেল্ড":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function AdminDashboard() {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    totalRevenue: 0,
    confirmedRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        return;
      }

      if (data) {
        setRecentOrders(data.slice(0, 5) as unknown as Order[]);
        
        const total = data.length;
        const pending = data.filter((o) => o.status === "পেন্ডিং").length;
        const confirmed = data.filter((o) => o.status === "কনফার্মড").length;
        const cancelled = data.filter((o) => o.status === "ক্যান্সেল্ড").length;
        const totalRevenue = data.reduce((sum, o) => sum + (o.total_amount || 0), 0);
        const confirmedRevenue = data
          .filter((o) => o.status === "কনফার্মড")
          .reduce((sum, o) => sum + (o.total_amount || 0), 0);

        setStats({ total, pending, confirmed, cancelled, totalRevenue, confirmedRevenue });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { label: "মোট অর্ডার", value: stats.total, icon: ShoppingCart, color: "text-blue-500" },
    { label: "পেন্ডিং", value: stats.pending, icon: Clock, color: "text-yellow-500" },
    { label: "কনফার্মড", value: stats.confirmed, icon: CheckCircle, color: "text-green-500" },
    { label: "ক্যান্সেল্ড", value: stats.cancelled, icon: XCircle, color: "text-red-500" },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-primary">ড্যাশবোর্ড</h2>
          <p className="text-muted-foreground">গত ৩০ দিনের সারসংক্ষেপ</p>
        </div>

        {/* Revenue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">মোট রেভিনিউ</p>
                <p className="text-3xl font-bold text-primary">৳{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">কনফার্মড রেভিনিউ</p>
                <p className="text-3xl font-bold text-green-600">৳{stats.confirmedRevenue.toLocaleString()}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">সাম্প্রতিক অর্ডার</h3>
          </div>
          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                এখনো কোনো অর্ডার নেই
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      অর্ডার নং
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      গ্রাহক
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      কোর্স
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      স্ট্যাটাস
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                      মূল্য
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-3 px-2 text-sm">{order.order_number}</td>
                      <td className="py-3 px-2 text-sm">{order.customer_name}</td>
                      <td className="py-3 px-2 text-sm">
                        {order.items?.map((item) => item.title).join(", ") || "-"}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm text-right font-medium">
                        ৳{order.total_amount?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
