-- Create page_sections table for storing editable page content
CREATE TABLE public.page_sections (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    page_slug text NOT NULL DEFAULT 'home',
    section_type text NOT NULL,
    section_key text NOT NULL,
    title text,
    subtitle text,
    description text,
    content jsonb DEFAULT '{}'::jsonb,
    image_url text,
    is_visible boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(page_slug, section_key)
);

-- Enable RLS
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

-- Anyone can view visible sections
CREATE POLICY "Anyone can view visible sections"
ON public.page_sections
FOR SELECT
USING (is_visible = true);

-- Admins can manage all sections
CREATE POLICY "Admins can manage all sections"
ON public.page_sections
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_page_sections_updated_at
BEFORE UPDATE ON public.page_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default homepage sections
INSERT INTO public.page_sections (page_slug, section_type, section_key, title, subtitle, description, content, sort_order) VALUES
('home', 'hero', 'hero', 'ডিজিটাল স্কিল শিখুন, ক্যারিয়ার গড়ুন', 'আপনার ক্যারিয়ারকে নতুন উচ্চতায় নিয়ে যান', 'বাংলাদেশের সেরা অনলাইন লার্নিং প্ল্যাটফর্ম থেকে প্রফেশনাল কোর্স করুন এবং নিজেকে প্রস্তুত করুন আগামীর জন্য।', '{"button_text": "কোর্স দেখুন", "button_link": "/courses"}', 1),
('home', 'features', 'why_us', 'কেন আমাদের বেছে নেবেন?', NULL, NULL, '{"features": [{"icon": "BookOpen", "title": "মানসম্মত কন্টেন্ট", "description": "ইন্ডাস্ট্রি এক্সপার্টদের দ্বারা তৈরি"}, {"icon": "Users", "title": "লাইভ সাপোর্ট", "description": "২৪/৭ সাপোর্ট টিম"}, {"icon": "Award", "title": "সার্টিফিকেট", "description": "কোর্স শেষে সার্টিফিকেট"}]}', 2),
('home', 'courses', 'popular_courses', 'জনপ্রিয় কোর্সসমূহ', NULL, 'আমাদের সবচেয়ে জনপ্রিয় কোর্সগুলো দেখুন', '{}', 3),
('home', 'testimonials', 'testimonials', 'শিক্ষার্থীদের মতামত', NULL, 'আমাদের কোর্স সম্পর্কে শিক্ষার্থীরা কি বলছেন', '{}', 4),
('home', 'about', 'about_instructor', 'ইন্সট্রাক্টর পরিচিতি', NULL, NULL, '{}', 5),
('home', 'cta', 'call_to_action', 'আজই শুরু করুন আপনার শেখার যাত্রা', NULL, 'হাজারো শিক্ষার্থীর সাথে যোগ দিন এবং নিজেকে গড়ে তুলুন', '{"button_text": "এখনই রেজিস্টার করুন", "button_link": "/courses"}', 6);