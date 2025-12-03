-- Create blogs table
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT NOT NULL,
  category_color TEXT DEFAULT 'bg-blue-500',
  image_url TEXT,
  author TEXT NOT NULL DEFAULT 'An-Nur Academy',
  link TEXT,
  is_published BOOLEAN DEFAULT true,
  published_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for blogs
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Anyone can view published blogs
CREATE POLICY "Anyone can view published blogs"
ON public.blogs
FOR SELECT
USING (is_published = true);

-- Admins can manage blogs
CREATE POLICY "Admins can manage blogs"
ON public.blogs
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for blogs updated_at
CREATE TRIGGER update_blogs_updated_at
BEFORE UPDATE ON public.blogs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  course TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can view published testimonials
CREATE POLICY "Anyone can view published testimonials"
ON public.testimonials
FOR SELECT
USING (is_published = true);

-- Admins can manage testimonials
CREATE POLICY "Admins can manage testimonials"
ON public.testimonials
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for testimonials updated_at
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial blogs data
INSERT INTO public.blogs (title, excerpt, category, category_color, image_url, author, published_at) VALUES
('অটো ব্লগিং এর ম্যাজিক: ChatGPT + n8n + WordPress!', 'আপনি যদি আপনার WordPress ওয়েবসাইট এ AI দিয়ে ব্লগ লিখাতে চান এবং ভাবেন প্রতিদিন AI আপনার জন্য একটা করে পোষ্ট করবে...', 'Web Development', 'bg-blue-500', '/src/assets/blog-wordpress-automation.jpg', 'An-Nur Academy', '2025-06-27'),
('যে অভ্যাসগুলো আপনাকে ভালো প্রোগ্রামার বানাবে', 'আপনার কি কখনো এমন হয়েছে যে কোডিং শেখার পরেও মনে রাখতে পারছেন না? হয়তো কোনো একটা ফাংশন লিখতে গিয়ে থেমে যাচ্ছেন...', 'Career Development', 'bg-purple-500', '/src/assets/blog-programming-habits.jpg', 'An-Nur Academy', '2024-12-11'),
('ওয়েব হোস্টিং এর ফাঁক ফোকর', 'আপনি যদি ওয়েব সাইট বানাতে চান আপনার অবশ্যই ভালো একটা হস্টিং প্রোভাইডার থেকে Web Host কিনতে হবে...', 'Tips and Tricks', 'bg-green-500', '/src/assets/blog-web-hosting.jpg', 'An-Nur Academy', '2024-11-12'),
('কিভাবে ধ্বংস করবেন আপনার ক্যারিয়ার?', 'আমার দীর্ঘ ১২+ বছরের ক্যারিয়ার কয়েকবার ধ্বংসের দ্বারপ্রান্তে পৌঁছেছিল, আমি শিক্ষা নিয়েছি এবং আবার ঘুরে দাঁড়িয়েছি...', 'Career Development', 'bg-purple-500', '/src/assets/blog-career-breaking.jpg', 'An-Nur Academy', '2024-11-10'),
('চাকরি দেয়ার সময় কোম্পানিগুলো কোন স্কিল দেখে?', 'আপনি কোড করতে জানেন একটা জব পাবার জন্য এতটুকুই যথেষ্ট না এর সাথে আপনার Problem solving Skill, communication...', 'Remote Job', 'bg-orange-500', '/src/assets/blog-remote-job-skills.jpg', 'An-Nur Academy', '2024-11-08'),
('ওয়েব ডেভেলপমেন্টের ভবিষ্যৎ কেমন?', 'GitHub co-pilot, ChatGPT, Open AI যে ভাবে এগিয়ে যাচ্ছে, ওয়েব ডেভেলপমেন্টের ক্যারিয়ার ধ্বংসের দিকে, আসলেই কি তাই?...', 'Web Development', 'bg-blue-500', '/src/assets/blog-web-dev-future.jpg', 'An-Nur Academy', '2024-11-05');

-- Insert initial testimonials data
INSERT INTO public.testimonials (name, course, content, image_url, rating) VALUES
('রাফি আহমেদ', 'Mastering AI with ChatGPT for Developers', 'I have just finished the course "Mastering AI with ChatGPT" by Ali Hossain, and it outdid my expectations. This course is very well structured, which is great for both beginners and experienced developers.', '/src/assets/testimonial-1.jpg', 5),
('তানভীর হাসান', 'WP Customization with WooCommerce', 'সম্পূর্ণ কোর্স শেষ করলাম, অসাধারণ ছিলো। অনেক কিছু শিখতে পেরেছি এই কোর্স থেকে।', '/src/assets/testimonial-2.jpg', 5),
('সাদিয়া খান', 'Remote Job: Work From Home For Developers', 'As a newbie in this marketplace, this has been such an awesome experience. I have learned a lot from here, and I am definitely gonna keep going.', '/src/assets/testimonial-3.jpg', 5),
('ফাহিম রহমান', 'WP Customization with WooCommerce', 'There were several things I needed to know about PROMT that I learned from this course. I hope the course will be updated more in the future.', '/src/assets/testimonial-4.jpg', 5),
('নাফিস ইসলাম', 'Mastering AI with ChatGPT for Developers', 'From my opinion, this course is very helpful specially for beginners those who do not have any knowledge about Chatbot.', '/src/assets/testimonial-5.jpg', 5),
('শাহরিয়ার কবির', 'Remote Job: Work From Home For Developers', 'It was very helpful for me. This course helped me to gain useful information about the remote jobs.', '/src/assets/testimonial-6.jpg', 5);