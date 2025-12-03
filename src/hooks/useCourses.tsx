import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Course {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  price: number;
  original_price: number | null;
  duration: string | null;
  instructor: string;
  category: string;
  level: string | null;
  rating: number | null;
  review_count: number | null;
  students_count: number | null;
  lessons_count: number | null;
  is_free: boolean | null;
  is_published: boolean | null;
  created_at: string;
  updated_at: string;
}

export type CourseInsert = Omit<Course, 'id' | 'created_at' | 'updated_at'>;
export type CourseUpdate = Partial<CourseInsert>;

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Course[];
    },
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Course | null;
    },
    enabled: !!id,
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
      return data as Course[];
    },
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (course: CourseInsert) => {
      const { data, error } = await supabase
        .from("courses")
        .insert(course)
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
      const { data, error } = await supabase
        .from("courses")
        .update(course)
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
