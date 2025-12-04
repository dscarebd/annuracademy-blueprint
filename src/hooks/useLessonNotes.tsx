import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LessonNote {
  id: string;
  user_id: string;
  course_id: string;
  module_index: number;
  lesson_index: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export const useLessonNote = (
  courseId: string,
  moduleIndex: number,
  lessonIndex: number
) => {
  return useQuery({
    queryKey: ["lesson-note", courseId, moduleIndex, lessonIndex],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("lesson_notes")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .eq("module_index", moduleIndex)
        .eq("lesson_index", lessonIndex)
        .maybeSingle();

      if (error) throw error;
      return data as LessonNote | null;
    },
    enabled: !!courseId,
  });
};

export const useCourseNotes = (courseId: string) => {
  return useQuery({
    queryKey: ["course-notes", courseId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("lesson_notes")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .order("module_index", { ascending: true })
        .order("lesson_index", { ascending: true });

      if (error) throw error;
      return data as LessonNote[];
    },
    enabled: !!courseId,
  });
};

export const useSaveNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      courseId,
      moduleIndex,
      lessonIndex,
      content,
    }: {
      courseId: string;
      moduleIndex: number;
      lessonIndex: number;
      content: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Use upsert to insert or update
      const { data, error } = await supabase
        .from("lesson_notes")
        .upsert(
          {
            user_id: user.id,
            course_id: courseId,
            module_index: moduleIndex,
            lesson_index: lessonIndex,
            content,
          },
          {
            onConflict: "user_id,course_id,module_index,lesson_index",
          }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["lesson-note", variables.courseId, variables.moduleIndex, variables.lessonIndex],
      });
      queryClient.invalidateQueries({
        queryKey: ["course-notes", variables.courseId],
      });
    },
  });
};

export const useDeleteNote = () => {
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
        .from("lesson_notes")
        .delete()
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .eq("module_index", moduleIndex)
        .eq("lesson_index", lessonIndex);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["lesson-note", variables.courseId, variables.moduleIndex, variables.lessonIndex],
      });
      queryClient.invalidateQueries({
        queryKey: ["course-notes", variables.courseId],
      });
    },
  });
};
