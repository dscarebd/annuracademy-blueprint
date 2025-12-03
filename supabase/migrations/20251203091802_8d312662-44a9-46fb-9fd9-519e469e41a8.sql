-- Add slug column to blogs table
ALTER TABLE public.blogs ADD COLUMN slug text UNIQUE;

-- Create function to generate slug from title
CREATE OR REPLACE FUNCTION public.generate_slug(title text)
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    base_slug text;
    final_slug text;
    counter integer := 0;
BEGIN
    -- Convert title to lowercase, replace spaces with hyphens, remove special characters
    base_slug := lower(regexp_replace(title, '[^a-zA-Z0-9\s\u0980-\u09FF]', '', 'g'));
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    base_slug := regexp_replace(base_slug, '-+', '-', 'g');
    base_slug := trim(both '-' from base_slug);
    
    -- If empty, use a random string
    IF base_slug = '' OR base_slug IS NULL THEN
        base_slug := 'blog-' || substring(gen_random_uuid()::text from 1 for 8);
    END IF;
    
    final_slug := base_slug;
    
    -- Check for duplicates and add counter if needed
    WHILE EXISTS (SELECT 1 FROM public.blogs WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$;

-- Create trigger to auto-generate slug on insert/update
CREATE OR REPLACE FUNCTION public.set_blog_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := generate_slug(NEW.title);
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_blog_slug_trigger
BEFORE INSERT OR UPDATE ON public.blogs
FOR EACH ROW
EXECUTE FUNCTION public.set_blog_slug();

-- Update existing blogs to have slugs
UPDATE public.blogs SET slug = generate_slug(title) WHERE slug IS NULL;