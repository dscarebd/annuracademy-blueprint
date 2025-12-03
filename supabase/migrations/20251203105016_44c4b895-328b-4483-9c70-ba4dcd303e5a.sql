-- Add instructor details columns to courses table
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS instructor_subtitle text DEFAULT '',
ADD COLUMN IF NOT EXISTS instructor_description text DEFAULT '',
ADD COLUMN IF NOT EXISTS instructor_image_url text DEFAULT '';