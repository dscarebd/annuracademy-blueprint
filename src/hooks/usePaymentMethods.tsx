import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PaymentMethod {
  id: string;
  name: string;
  number: string;
  color: string;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ["payment-methods"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as PaymentMethod[];
    },
  });
};

export const useAllPaymentMethods = () => {
  return useQuery({
    queryKey: ["all-payment-methods"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as PaymentMethod[];
    },
  });
};

export const useCreatePaymentMethod = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (paymentMethod: Omit<PaymentMethod, "id" | "created_at" | "updated_at" | "icon">) => {
      const { data, error } = await supabase
        .from("payment_methods")
        .insert(paymentMethod)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      queryClient.invalidateQueries({ queryKey: ["all-payment-methods"] });
      toast({ title: "পেমেন্ট মেথড যোগ করা হয়েছে" });
    },
    onError: (error: Error) => {
      toast({
        title: "পেমেন্ট মেথড যোগ করা যায়নি",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PaymentMethod> & { id: string }) => {
      const { data, error } = await supabase
        .from("payment_methods")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      queryClient.invalidateQueries({ queryKey: ["all-payment-methods"] });
      toast({ title: "পেমেন্ট মেথড আপডেট করা হয়েছে" });
    },
    onError: (error: Error) => {
      toast({
        title: "পেমেন্ট মেথড আপডেট করা যায়নি",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("payment_methods")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      queryClient.invalidateQueries({ queryKey: ["all-payment-methods"] });
      toast({ title: "পেমেন্ট মেথড মুছে ফেলা হয়েছে" });
    },
    onError: (error: Error) => {
      toast({
        title: "পেমেন্ট মেথড মুছে ফেলা যায়নি",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
