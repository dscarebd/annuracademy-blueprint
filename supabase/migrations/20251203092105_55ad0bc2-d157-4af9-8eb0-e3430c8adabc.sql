-- Add slug column to courses table
ALTER TABLE public.courses ADD COLUMN slug text UNIQUE;

-- Create function to generate course slug from title
CREATE OR REPLACE FUNCTION public.generate_course_slug(title text)
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    base_slug text;
    final_slug text;
    counter integer := 0;
BEGIN
    -- Convert title to lowercase, keep only English letters, numbers, and spaces
    -- This effectively removes Bangla characters and creates an English-friendly slug
    base_slug := lower(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'));
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    base_slug := regexp_replace(base_slug, '-+', '-', 'g');
    base_slug := trim(both '-' from base_slug);
    
    -- If empty (all Bangla text), use 'course' as base with random suffix
    IF base_slug = '' OR base_slug IS NULL THEN
        base_slug := 'course-' || substring(gen_random_uuid()::text from 1 for 8);
    END IF;
    
    final_slug := base_slug;
    
    -- Check for duplicates and add counter if needed
    WHILE EXISTS (SELECT 1 FROM public.courses WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$;

-- Create trigger to auto-generate slug on insert/update
CREATE OR REPLACE FUNCTION public.set_course_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := generate_course_slug(NEW.title);
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_course_slug_trigger
BEFORE INSERT OR UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.set_course_slug();

-- Update existing courses to have slugs
UPDATE public.courses SET slug = generate_course_slug(title) WHERE slug IS NULL;