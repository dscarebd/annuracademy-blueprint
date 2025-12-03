-- Add new columns to courses table for editable content
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS learning_outcomes jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS requirements jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS modules jsonb DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.courses.learning_outcomes IS 'Array of strings for what students will learn';
COMMENT ON COLUMN public.courses.requirements IS 'Array of strings for course requirements';
COMMENT ON COLUMN public.courses.modules IS 'Array of module objects with title and lessons';