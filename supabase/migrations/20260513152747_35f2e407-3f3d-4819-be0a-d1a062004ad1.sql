
CREATE TABLE IF NOT EXISTS public.blog_publish_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id UUID,
  blog_title TEXT NOT NULL,
  blog_slug TEXT,
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_publish_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view blog publish log" ON public.blog_publish_log;
CREATE POLICY "Admins can view blog publish log"
ON public.blog_publish_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete blog publish log" ON public.blog_publish_log;
CREATE POLICY "Admins can delete blog publish log"
ON public.blog_publish_log
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_blog_publish_log_published_at
  ON public.blog_publish_log (published_at DESC);

-- Update the auto-publish function to record history
CREATE OR REPLACE FUNCTION public.publish_scheduled_blogs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  WITH updated AS (
    UPDATE public.blogs
    SET is_published = true,
        published_at = COALESCE(published_at, CURRENT_DATE),
        updated_at = now()
    WHERE is_published = false
      AND scheduled_at IS NOT NULL
      AND scheduled_at <= now()
    RETURNING id, title, slug, scheduled_at
  ),
  logged AS (
    INSERT INTO public.blog_publish_log (blog_id, blog_title, blog_slug, scheduled_at, published_at)
    SELECT id, title, slug, scheduled_at, now() FROM updated
    RETURNING blog_id
  )
  UPDATE public.blogs
  SET scheduled_at = NULL
  WHERE id IN (SELECT blog_id FROM logged);
END;
$$;
