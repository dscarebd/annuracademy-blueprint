-- Create social media links table
CREATE TABLE public.social_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  url TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'bg-blue-600 hover:bg-blue-700',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Anyone can view active social links
CREATE POLICY "Anyone can view active social links"
ON public.social_links
FOR SELECT
USING (is_active = true);

-- Admins can manage social links
CREATE POLICY "Admins can manage social links"
ON public.social_links
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_social_links_updated_at
BEFORE UPDATE ON public.social_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default social links
INSERT INTO public.social_links (name, icon, url, color, sort_order) VALUES
('Facebook', 'Facebook', 'https://facebook.com', 'bg-blue-600 hover:bg-blue-700', 1),
('Telegram', 'Send', 'https://t.me', 'bg-sky-500 hover:bg-sky-600', 2),
('YouTube', 'Youtube', 'https://youtube.com', 'bg-red-600 hover:bg-red-700', 3),
('Email', 'Mail', 'mailto:contact@example.com', 'bg-emerald-600 hover:bg-emerald-700', 4);