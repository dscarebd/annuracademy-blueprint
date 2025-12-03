-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  original_price INTEGER,
  duration TEXT,
  instructor TEXT NOT NULL DEFAULT 'NUR AL-AMIN',
  category TEXT NOT NULL,
  level TEXT DEFAULT 'Beginner',
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  students_count INTEGER DEFAULT 0,
  lessons_count INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Anyone can read published courses
CREATE POLICY "Anyone can view published courses"
ON public.courses
FOR SELECT
USING (is_published = true);

-- Admins can do everything
CREATE POLICY "Admins can manage courses"
ON public.courses
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial courses data
INSERT INTO public.courses (title, description, image_url, price, original_price, duration, instructor, category, level, rating, review_count, is_free, is_published) VALUES
('ওয়ার্ডপ্রেস কাস্টমাইজেশন উইথ উকমার্স', 'ওয়ার্ডপ্রেস দিয়ে প্রফেশনাল ওয়েবসাইট তৈরি করুন', '/src/assets/course-wordpress.jpg', 1499, 2990, '25h 20m', 'NUR AL-AMIN', 'WordPress', 'Beginner', 5.0, 30, false, true),
('রিমোট জব, ওয়ার্ক ফ্রম হোম ফর ডেভেলপার্স', 'রিমোট জব পেতে কমপ্লিট গাইডলাইন', '/src/assets/course-remote-job.jpg', 1199, 1990, '1h 30m', 'NUR AL-AMIN', 'Career Development', 'Intermediate', 4.92, 12, false, true),
('ক্যানভা মাস্টারক্লাস ১০১', 'ক্যানভা দিয়ে প্রফেশনাল ডিজাইন শিখুন', '/src/assets/course-canva.jpg', 0, NULL, '1h', 'NUR AL-AMIN', 'Design', 'Beginner', 5.0, 7, true, true),
('ফিগমা এসেনশিয়ালস ট্রেনিং ফর ডেভেলপার্স', 'ফিগমা থেকে কোড করা শিখুন', '/src/assets/course-figma.jpg', 999, 1490, '3h 15m', 'NUR AL-AMIN', 'Design', 'Beginner', 5.0, 1, false, true),
('ওয়েবফ্লো মাস্টারক্লাস ১০১', 'ওয়েবফ্লো দিয়ে নো-কোড ওয়েবসাইট তৈরি', '/src/assets/course-webflow.jpg', 999, 1490, '4h', 'NUR AL-AMIN', 'No Code', 'Beginner', 0, 0, false, true);