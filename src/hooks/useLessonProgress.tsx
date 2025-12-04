import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LessonProgress {
  id: string;
  user_id: string;
  course_id: string;
  module_index: number;
  lesson_index: number;
  completed_at: string;
}

export const useLessonProgress = (courseId: string) => {
  return useQuery({
    queryKey: ["lesson-progress", courseId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("lesson_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", courseId);

      if (error) throw error;
      return data as LessonProgress[];
    },
    enabled: !!courseId,
  });
};

export const useMarkLessonComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      courseId,
      moduleIndex,
      lessonIndex,
    }: {
      courseId: string;
      moduleIndex: number;
      lessonIndex: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("lesson_progress")
        .insert({
          user_id: user.id,
          course_id: courseId,
          module_index: moduleIndex,
          lesson_index: lessonIndex,
        })
        .select()
        .single();

      if (error) {
        // If already exists, that's fine
        if (error.code === "23505") return null;
        throw error;
      }
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lesson-progress", variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
};

export const useUnmarkLessonComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      courseId,
      moduleIndex,
      lessonIndex,
    }: {
      courseId: string;
      moduleIndex: number;
      lessonIndex: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("lesson_progress")
        .delete()
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .eq("module_index", moduleIndex)
        .eq("lesson_index", lessonIndex);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lesson-progress", variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
};

export const useUpdateEnrollmentProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      courseId,
      progress,
    }: {
      courseId: string;
      progress: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("enrollments")
        .update({ 
          progress,
          completed_at: progress >= 100 ? new Date().toISOString() : null 
        })
        .eq("user_id", user.id)
        .eq("course_id", courseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
};
