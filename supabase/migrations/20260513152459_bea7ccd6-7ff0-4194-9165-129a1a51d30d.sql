
-- Add scheduled_at to blogs for scheduled publishing
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_blogs_scheduled_at ON public.blogs (scheduled_at) WHERE scheduled_at IS NOT NULL AND is_published = false;

-- Function to publish scheduled blogs whose time has come
CREATE OR REPLACE FUNCTION public.publish_scheduled_blogs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.blogs
  SET is_published = true,
      published_at = COALESCE(published_at, CURRENT_DATE),
      scheduled_at = NULL,
      updated_at = now()
  WHERE is_published = false
    AND scheduled_at IS NOT NULL
    AND scheduled_at <= now();
END;
$$;

-- Enable pg_cron and schedule every minute
CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'publish-scheduled-blogs') THEN
    PERFORM cron.unschedule('publish-scheduled-blogs');
  END IF;
END $$;

SELECT cron.schedule(
  'publish-scheduled-blogs',
  '* * * * *',
  $$ SELECT public.publish_scheduled_blogs(); $$
);
