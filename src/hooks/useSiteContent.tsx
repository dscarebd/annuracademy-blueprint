import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SiteContent {
  id: string;
  content_key: string;
  content_type: string;
  page: string;
  section: string;
  label: string;
  value: string | null;
  json_value: any;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Get single content by key
export const useSiteContent = (contentKey: string) => {
  return useQuery({
    queryKey: ["site-content", contentKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("content_key", contentKey)
        .single();
      
      if (error) throw error;
      return data as SiteContent;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get multiple content by keys
export const useSiteContentMultiple = (contentKeys: string[]) => {
  return useQuery({
    queryKey: ["site-content-multiple", contentKeys],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .in("content_key", contentKeys);
      
      if (error) throw error;
      
      // Convert to a map for easy access
      const contentMap: Record<string, SiteContent> = {};
      data?.forEach((item) => {
        contentMap[item.content_key] = item as SiteContent;
      });
      return contentMap;
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Get all content for a page
export const usePageContent = (page: string) => {
  return useQuery({
    queryKey: ["site-content-page", page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("page", page)
        .order("section")
        .order("sort_order");
      
      if (error) throw error;
      
      // Group by section
      const grouped: Record<string, SiteContent[]> = {};
      data?.forEach((item) => {
        if (!grouped[item.section]) {
          grouped[item.section] = [];
        }
        grouped[item.section].push(item as SiteContent);
      });
      return { items: data as SiteContent[], grouped };
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Get all site content (for admin)
export const useAllSiteContent = () => {
  return useQuery({
    queryKey: ["site-content-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .order("page")
        .order("section")
        .order("sort_order");
      
      if (error) throw error;
      return data as SiteContent[];
    },
  });
};

// Update content
export const useUpdateSiteContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, value, json_value }: { id: string; value?: string | null; json_value?: any }) => {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (value !== undefined) updateData.value = value;
      if (json_value !== undefined) updateData.json_value = json_value;
      
      const { data, error } = await supabase
        .from("site_content")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
      queryClient.invalidateQueries({ queryKey: ["site-content-multiple"] });
      queryClient.invalidateQueries({ queryKey: ["site-content-page"] });
      queryClient.invalidateQueries({ queryKey: ["site-content-all"] });
      toast.success("সংরক্ষিত হয়েছে!");
    },
    onError: (error) => {
      toast.error("সংরক্ষণ করা যায়নি");
      console.error(error);
    },
  });
};

// Helper to get content value with fallback
export const getContentValue = (
  contentMap: Record<string, SiteContent> | undefined,
  key: string,
  fallback: string = ""
): string => {
  return contentMap?.[key]?.value || fallback;
};

export const getContentJson = <T,>(
  contentMap: Record<string, SiteContent> | undefined,
  key: string,
  fallback: T
): T => {
  return contentMap?.[key]?.json_value || fallback;
};
