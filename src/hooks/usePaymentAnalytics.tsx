import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PaymentAnalytics {
  payment_method: string;
  count: number;
  total_amount: number;
}

export const usePaymentAnalytics = () => {
  return useQuery({
    queryKey: ["payment-analytics"],
    queryFn: async () => {
      // Get all orders with confirmed status
      const { data: orders, error } = await supabase
        .from("orders")
        .select("payment_method, total_amount, status")
        .eq("status", "কনফার্মড");

      if (error) throw error;

      // Aggregate by payment method
      const analytics: Record<string, { count: number; total_amount: number }> = {};
      
      orders?.forEach((order) => {
        if (!analytics[order.payment_method]) {
          analytics[order.payment_method] = { count: 0, total_amount: 0 };
        }
        analytics[order.payment_method].count += 1;
        analytics[order.payment_method].total_amount += order.total_amount;
      });

      // Convert to array
      const result: PaymentAnalytics[] = Object.entries(analytics).map(([method, data]) => ({
        payment_method: method,
        count: data.count,
        total_amount: data.total_amount,
      }));

      // Sort by count descending
      result.sort((a, b) => b.count - a.count);

      return {
        data: result,
        totalOrders: orders?.length || 0,
        totalRevenue: orders?.reduce((sum, o) => sum + o.total_amount, 0) || 0,
      };
    },
  });
};
