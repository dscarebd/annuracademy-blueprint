
CREATE OR REPLACE FUNCTION public.run_publish_scheduled_blogs_now()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected integer;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  WITH updated AS (
    UPDATE public.blogs
    SET is_published = true,
        published_at = COALESCE(published_at, CURRENT_DATE),
        updated_at = now()
    WHERE is_published = false
      AND scheduled_at IS NOT NULL
    RETURNING id, title, slug, scheduled_at
  ),
  logged AS (
    INSERT INTO public.blog_publish_log (blog_id, blog_title, blog_slug, scheduled_at, published_at)
    SELECT id, title, slug, scheduled_at, now() FROM updated
    RETURNING blog_id
  ),
  cleared AS (
    UPDATE public.blogs SET scheduled_at = NULL
    WHERE id IN (SELECT blog_id FROM logged)
    RETURNING id
  )
  SELECT count(*) INTO affected FROM cleared;

  RETURN affected;
END;
$$;
