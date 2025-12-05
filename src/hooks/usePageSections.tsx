import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PageSection {
  id: string;
  page_slug: string;
  section_type: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  content: Record<string, any>;
  image_url: string | null;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const usePageSections = (pageSlug: string = "home") => {
  return useQuery({
    queryKey: ["page-sections", pageSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page_slug", pageSlug)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as PageSection[];
    },
  });
};

export const useAllPageSections = (pageSlug: string = "home") => {
  return useQuery({
    queryKey: ["all-page-sections", pageSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page_slug", pageSlug)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as PageSection[];
    },
  });
};

export const useUpdatePageSection = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PageSection> & { id: string }) => {
      const { data, error } = await supabase
        .from("page_sections")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page-sections"] });
      queryClient.invalidateQueries({ queryKey: ["all-page-sections"] });
      toast({ title: "সেকশন আপডেট হয়েছে" });
    },
    onError: (error: Error) => {
      toast({
        title: "সেকশন আপডেট ব্যর্থ",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSectionOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (sections: { id: string; sort_order: number }[]) => {
      const promises = sections.map(({ id, sort_order }) =>
        supabase
          .from("page_sections")
          .update({ sort_order })
          .eq("id", id)
      );
      
      const results = await Promise.all(promises);
      const errors = results.filter(r => r.error);
      if (errors.length > 0) throw new Error("Failed to update order");
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page-sections"] });
      queryClient.invalidateQueries({ queryKey: ["all-page-sections"] });
      toast({ title: "সেকশন ক্রম আপডেট হয়েছে" });
    },
    onError: (error: Error) => {
      toast({
        title: "ক্রম আপডেট ব্যর্থ",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCreatePageSection = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (section: Omit<PageSection, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("page_sections")
        .insert(section)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page-sections"] });
      queryClient.invalidateQueries({ queryKey: ["all-page-sections"] });
      toast({ title: "সেকশন যোগ হয়েছে" });
    },
    onError: (error: Error) => {
      toast({
        title: "সেকশন যোগ ব্যর্থ",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeletePageSection = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("page_sections")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page-sections"] });
      queryClient.invalidateQueries({ queryKey: ["all-page-sections"] });
      toast({ title: "সেকশন মুছে ফেলা হয়েছে" });
    },
    onError: (error: Error) => {
      toast({
        title: "সেকশন মুছতে ব্যর্থ",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
