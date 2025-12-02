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
import { Eye, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  payment_method: string;
  transaction_id: string;
  status: string;
  total_amount: number;
  items: Array<{ id: number; title: string; price: number }>;
  created_at: string;
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

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "অর্ডার লোড করতে সমস্যা",
          variant: "destructive",
        });
        return;
      }

      setOrders(data as unknown as Order[]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order:", error);
      toast({
        title: "স্ট্যাটাস আপডেট করতে সমস্যা",
        variant: "destructive",
      });
      return;
    }

    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    toast({
      title: "স্ট্যাটাস আপডেট হয়েছে",
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("bn-BD");
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">অর্ডার ম্যানেজমেন্ট</h2>
            <p className="text-muted-foreground">সকল অর্ডার দেখুন ও ম্যানেজ করুন</p>
          </div>
          <Button variant="outline" onClick={fetchOrders}>
            <RefreshCw className="h-4 w-4 mr-2" />
            রিফ্রেশ
          </Button>
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
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-3 px-2 text-sm font-mono">{order.order_number}</td>
                      <td className="py-3 px-2">
                        <div>
                          <p className="text-sm font-medium">{order.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{order.customer_phone}</p>
                          <p className="text-xs text-muted-foreground">{order.payment_method}: {order.transaction_id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm">
                        {order.items?.map((item) => item.title).join(", ") || "-"}
                      </td>
                      <td className="py-3 px-2 text-sm">{formatDate(order.created_at)}</td>
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
                        ৳{order.total_amount?.toLocaleString()}
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
