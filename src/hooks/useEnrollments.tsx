import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  order_id: string | null;
  enrolled_at: string;
  progress: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  course?: {
    id: string;
    title: string;
    image_url: string | null;
    instructor: string;
    category: string;
    modules: any;
    slug: string | null;
    duration: string | null;
    lessons_count: number | null;
    level: string | null;
    description: string | null;
  };
}

export const useEnrollments = () => {
  return useQuery({
    queryKey: ["enrollments"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          *,
          course:courses(id, title, image_url, instructor, category, modules, slug, duration, lessons_count, level, description)
        `)
        .eq("user_id", user.id)
        .order("enrolled_at", { ascending: false });

      if (error) throw error;
      return data as Enrollment[];
    },
  });
};

export const useCheckEnrollment = (courseId: string) => {
  return useQuery({
    queryKey: ["enrollment", courseId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });
};

export const useCreateEnrollment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ courseId, orderId }: { courseId: string; orderId?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("enrollments")
        .insert({
          user_id: user.id,
          course_id: courseId,
          order_id: orderId || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      toast({
        title: "সফল!",
        description: "কোর্সে এনরোল হয়েছেন।",
      });
    },
    onError: (error: any) => {
      toast({
        title: "ত্রুটি",
        description: error.message || "এনরোল করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ enrollmentId, progress }: { enrollmentId: string; progress: number }) => {
      const { data, error } = await supabase
        .from("enrollments")
        .update({ 
          progress,
          completed_at: progress >= 100 ? new Date().toISOString() : null 
        })
        .eq("id", enrollmentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
};
