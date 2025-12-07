import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export type VideoSourceType = 'youtube' | 'vimeo' | 'upload';

export interface CourseLesson {
  name: string;
  duration: string;
  preview: boolean;
  video_url?: string;
  video_source_type?: VideoSourceType;
}

export interface CourseModule {
  title: string;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  image_url: string | null;
  price: number;
  original_price: number | null;
  duration: string | null;
  instructor: string;
  instructor_subtitle: string | null;
  instructor_description: string | null;
  instructor_image_url: string | null;
  category: string;
  level: string | null;
  rating: number | null;
  review_count: number | null;
  students_count: number | null;
  lessons_count: number | null;
  is_free: boolean | null;
  is_published: boolean | null;
  learning_outcomes: string[] | null;
  requirements: string[] | null;
  modules: CourseModule[] | null;
  created_at: string;
  updated_at: string;
}

export type CourseInsert = Omit<Course, 'id' | 'created_at' | 'updated_at' | 'slug'>;
export type CourseUpdate = Partial<CourseInsert>;

function transformCourse(data: Record<string, unknown>): Course {
  return {
    ...data,
    learning_outcomes: data.learning_outcomes as string[] | null,
    requirements: data.requirements as string[] | null,
    modules: data.modules as CourseModule[] | null,
  } as Course;
}

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(item => transformCourse(item as Record<string, unknown>));
    },
  });
}

export function useCourseBySlug(slug: string) {
  return useQuery({
    queryKey: ["course", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data ? transformCourse(data as Record<string, unknown>) : null;
    },
    enabled: !!slug,
  });
}

export function useAdminCourses() {
  return useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(item => transformCourse(item as Record<string, unknown>));
    },
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (course: CourseInsert) => {
      const { data, error } = await supabase
        .from("courses")
        .insert({
          ...course,
          learning_outcomes: course.learning_outcomes as unknown as Json,
          requirements: course.requirements as unknown as Json,
          modules: course.modules as unknown as Json,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...course }: CourseUpdate & { id: string }) => {
      const updateData: Record<string, unknown> = { ...course };
      if (course.learning_outcomes !== undefined) {
        updateData.learning_outcomes = course.learning_outcomes as unknown as Json;
      }
      if (course.requirements !== undefined) {
        updateData.requirements = course.requirements as unknown as Json;
      }
      if (course.modules !== undefined) {
        updateData.modules = course.modules as unknown as Json;
      }

      const { data, error } = await supabase
        .from("courses")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
    },
  });
}