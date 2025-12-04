import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  payment_method: string;
  transaction_id: string;
  status: string;
  total_amount: number;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export const useUserOrders = () => {
  return useQuery({
    queryKey: ["user-orders"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.email) {
        return [];
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_email", user.email.toLowerCase())
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }

      return (data || []).map(order => ({
        ...order,
        items: order.items as unknown as OrderItem[]
      })) as Order[];
    },
  });
};
