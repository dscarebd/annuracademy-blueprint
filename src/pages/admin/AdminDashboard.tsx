import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  Truck,
  Package,
  XCircle,
  TrendingUp,
} from "lucide-react";

const stats = [
  { label: "মোট অর্ডার", value: 12, icon: ShoppingCart, color: "text-blue-500" },
  { label: "পেন্ডিং", value: 3, icon: Clock, color: "text-yellow-500" },
  { label: "কনফার্মড", value: 4, icon: CheckCircle, color: "text-green-500" },
  { label: "শিপিং", value: 2, icon: Truck, color: "text-purple-500" },
  { label: "ডেলিভার্ড", value: 2, icon: Package, color: "text-emerald-500" },
  { label: "ক্যান্সেল্ড", value: 1, icon: XCircle, color: "text-red-500" },
];

const recentOrders = [
  {
    id: "ORD-20251202-0001",
    customer: "রহিম উদ্দিন",
    course: "WordPress Masterclass",
    status: "কনফার্মড",
    amount: "৳১,৯৯০",
  },
  {
    id: "ORD-20251202-0002",
    customer: "করিম হাসান",
    course: "Figma to Dev",
    status: "পেন্ডিং",
    amount: "৳২,৪৯০",
  },
  {
    id: "ORD-20251201-0003",
    customer: "সালমা বেগম",
    course: "Remote Job Masterclass",
    status: "ডেলিভার্ড",
    amount: "৳১,৪৯০",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "পেন্ডিং":
      return "bg-yellow-100 text-yellow-800";
    case "কনফার্মড":
      return "bg-blue-100 text-blue-800";
    case "ডেলিভার্ড":
      return "bg-green-100 text-green-800";
    case "ক্যান্সেল্ড":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function AdminDashboard() {
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
                <p className="text-3xl font-bold text-primary">৳৮৪,২৯৪</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ডেলিভার্ড রেভিনিউ</p>
                <p className="text-3xl font-bold text-green-600">৳৮৪৮</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat) => (
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
                    <td className="py-3 px-2 text-sm">{order.id}</td>
                    <td className="py-3 px-2 text-sm">{order.customer}</td>
                    <td className="py-3 px-2 text-sm">{order.course}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-right font-medium">
                      {order.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
