-- Add last watched lesson columns to enrollments
ALTER TABLE public.enrollments 
ADD COLUMN IF NOT EXISTS last_module_index integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_lesson_index integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_watched_at timestamp with time zone;