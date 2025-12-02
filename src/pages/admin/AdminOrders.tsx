import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye } from "lucide-react";
import { useState } from "react";

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  course: string;
  status: string;
  amount: string;
  date: string;
}

const initialOrders: Order[] = [];

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

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const updateStatus = (orderId: string, newStatus: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">অর্ডার ম্যানেজমেন্ট</h2>
            <p className="text-muted-foreground">সকল অর্ডার দেখুন ও ম্যানেজ করুন</p>
          </div>
        </div>

        <Card className="p-6">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              এখনো কোনো অর্ডার নেই
            </div>
          ) : (
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
                      তারিখ
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      স্ট্যাটাস
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                      মূল্য
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                      অ্যাকশন
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-3 px-2 text-sm font-mono">{order.id}</td>
                      <td className="py-3 px-2">
                        <div>
                          <p className="text-sm font-medium">{order.customer}</p>
                          <p className="text-xs text-muted-foreground">{order.phone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm">{order.course}</td>
                      <td className="py-3 px-2 text-sm">{order.date}</td>
                      <td className="py-3 px-2">
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="পেন্ডিং">পেন্ডিং</SelectItem>
                            <SelectItem value="কনফার্মড">কনফার্মড</SelectItem>
                            <SelectItem value="ক্যান্সেল্ড">ক্যান্সেল্ড</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-2 text-sm text-right font-medium">
                        {order.amount}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
