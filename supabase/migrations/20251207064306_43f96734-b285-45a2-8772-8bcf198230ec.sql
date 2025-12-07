-- Create site_content table for managing all editable content
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key TEXT UNIQUE NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'text',
  page TEXT NOT NULL DEFAULT 'global',
  section TEXT NOT NULL,
  label TEXT NOT NULL,
  value TEXT,
  json_value JSONB,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view site content" 
ON public.site_content 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage site content" 
ON public.site_content 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content data

-- Global content
INSERT INTO public.site_content (content_key, content_type, page, section, label, value, sort_order) VALUES
('top_banner_text', 'text', 'global', 'header', 'টপ ব্যানার টেক্সট', '২০% ডিসকাউন্ট পেতে কুপন কোড "GIFT20"', 1),
('footer_brand_description', 'textarea', 'global', 'footer', 'ফুটার ব্র্যান্ড বর্ণনা', 'দ্রুত পরিবর্তনশীল ডিজিটাল যুগের সাথে তাল মিলিয়ে চলার জন্য প্রয়োজনীয় দক্ষতা এবং জ্ঞান অর্জনে সাহায্য করতে প্রতিশ্রুতিবদ্ধ।', 2),
('footer_copyright', 'text', 'global', 'footer', 'কপিরাইট টেক্সট', '© ২০২৫ An-Nur Academy. সর্বস্বত্ব সংরক্ষিত।', 3);

-- Home page - Why Section
INSERT INTO public.site_content (content_key, content_type, page, section, label, value, sort_order) VALUES
('why_left_heading', 'textarea', 'home', 'why_section', 'বাম কার্ড হেডিং', 'লাখ টাকা আয়ের স্বপ্নে বিভোর না হয়ে\nস্কিল ডেভেলপ করে নিজের স্বপ্ন সত্যি করুন', 1),
('why_right_heading', 'text', 'home', 'why_section', 'ডান কার্ড হেডিং', 'কেন?', 2),
('why_brand_name', 'text', 'home', 'why_section', 'ব্র্যান্ড নাম', 'An-Nur', 3),
('why_brand_tagline', 'text', 'home', 'why_section', 'ব্র্যান্ড ট্যাগলাইন', 'ACADEMY', 4),
('why_description', 'textarea', 'home', 'why_section', 'বর্ণনা', 'শিক্ষার্থীরা আমাদের কোর্স কিনে কারণ আমরা শেখাই একদম সহজভাবে, ধাপে ধাপে এবং বাস্তবে কাজে লাগে এমন স্কিল। এখানে অযথা জটিল তত্ত্ব নেই—বরং যা শিখবেন, তা সরাসরি নিজের কাজ, ক্যারিয়ার বা ফ্রিল্যান্সিংয়ে ব্যবহার করতে পারবেন। প্রতিটি কোর্স নতুনদের কথা ভেবেই তৈরি, যাতে যেকোনো শিক্ষার্থী খুব সহজে শুরু করতে পারে এবং নিশ্চিতভাবে অগ্রগতি দেখতে পায়। আমরা শুধু কোর্স দিই না—শেখার সময় যেকোনো সমস্যায় পাশে থাকার প্রতিশ্রুতিও দিই। তাই যারা সত্যি স্কিল শিখে সামনে এগোতে চান, তাদের জন্য আমাদের কোর্স একটি সঠিক ও নিরাপদ বিনিয়োগ।', 5);

-- Home page - Course Features Section
INSERT INTO public.site_content (content_key, content_type, page, section, label, value, sort_order) VALUES
('features_heading', 'text', 'home', 'features_section', 'সেকশন হেডিং', 'An-Nur Academy কোর্সে যা পাচ্ছেন', 1),
('features_description', 'textarea', 'home', 'features_section', 'সেকশন বর্ণনা', 'প্রতিটি কোর্সে পাবেন প্রজেক্ট, সাপোর্ট এবং ইন্ডাস্ট্রি এক্সপার্টদের গাইডলাইন—যা আপনাকে বাস্তব কাজের জন্য তৈরি করবে', 2);

INSERT INTO public.site_content (content_key, content_type, page, section, label, json_value, sort_order) VALUES
('features_list', 'json', 'home', 'features_section', 'ফিচার লিস্ট', '[
  {"icon": "FolderOpen", "title": "প্রোজেক্ট ভিত্তিক স্টাডি", "description": "প্রতিটি কোর্সে পাবেন বাস্তব প্রজেক্ট, যা আপনাকে ইন্ডাস্ট্রি রেডি করে তুলবে।"},
  {"icon": "Repeat", "title": "নিয়মিত মেথডস মাস্টারিং", "description": "স্কিল ডেভেলপমেন্টে সাহায্য করতে প্রতিনিয়ত লাইভ সেশন ও আপডেটেড কন্টেন্ট।"},
  {"icon": "Award", "title": "শিখুন মার্কেট এক্সপার্ট থেকে", "description": "ইন্ডাস্ট্রি এক্সপার্টদের সাথে শিখুন ও তাদের অভিজ্ঞতা থেকে শিখে এগিয়ে যান।"}
]', 3);

-- Home page - About Instructor Section
INSERT INTO public.site_content (content_key, content_type, page, section, label, value, sort_order) VALUES
('instructor_section_heading', 'text', 'home', 'about_instructor', 'সেকশন হেডিং', 'প্রশিক্ষক সম্পর্কে', 1),
('instructor_section_subtitle', 'text', 'home', 'about_instructor', 'সেকশন সাবটাইটেল', 'যার কাছ থেকে শিখবেন', 2),
('instructor_name', 'text', 'home', 'about_instructor', 'প্রশিক্ষকের নাম', 'NUR AL-AMIN', 3),
('instructor_title', 'text', 'home', 'about_instructor', 'প্রশিক্ষকের পদবী', 'ফাউন্ডার ও লিড ইন্সট্রাক্টর, An-Nur Academy', 4),
('instructor_image', 'image', 'home', 'about_instructor', 'প্রশিক্ষকের ছবি', '/src/assets/instructor-about.jpg', 5),
('instructor_bio', 'textarea', 'home', 'about_instructor', 'প্রশিক্ষকের বায়ো', 'আমি NUR AL-AMIN, An-Nur Academy-র ফাউন্ডার। বিগত ৩ বছরেরও বেশি সময় ধরে আমি ডিজিটাল স্কিল ডেভেলপমেন্ট এবং অনলাইন শিক্ষার ক্ষেত্রে কাজ করে আসছি।\n\nআমার মূল লক্ষ্য হলো—প্রযুক্তি এবং স্কিল শেখাকে সহজ, বাস্তবসম্মত ও সবার জন্য সহজলভ্য করে তোলা।\n\nAn-Nur Academy প্রতিষ্ঠা করেছি যাতে শিক্ষার্থীরা ঘরে বসেই মানসম্মত শিক্ষা পায় এবং নিজেদের ক্যারিয়ার তৈরি করতে পারে।', 6);

-- About page content
INSERT INTO public.site_content (content_key, content_type, page, section, label, value, sort_order) VALUES
('about_hero_heading', 'text', 'about', 'hero', 'হিরো হেডিং', 'আমাদের সম্পর্কে', 1),
('about_hero_subheading', 'text', 'about', 'hero', 'হিরো সাব-হেডিং', 'শেখার নতুন যুগে স্বাগতম', 2),
('about_founder_name', 'text', 'about', 'founder', 'ফাউন্ডারের নাম', 'NUR AL-AMIN', 1),
('about_founder_title', 'text', 'about', 'founder', 'ফাউন্ডারের পদবী', 'ফাউন্ডার ও লিড ইন্সট্রাক্টর', 2),
('about_founder_image', 'image', 'about', 'founder', 'ফাউন্ডারের ছবি', '/src/assets/instructor-about.jpg', 3),
('about_founder_bio', 'textarea', 'about', 'founder', 'ফাউন্ডারের বায়ো', 'আমি NUR AL-AMIN, An-Nur Academy-র ফাউন্ডার ও লিড ইন্সট্রাক্টর। বিগত ৩ বছরেরও বেশি সময় ধরে আমি ডিজিটাল স্কিল ডেভেলপমেন্ট এবং অনলাইন শিক্ষার ক্ষেত্রে কাজ করে আসছি। আমি বিশ্বাস করি, সঠিক শিক্ষা এবং দিকনির্দেশনা পেলে যে কেউ নিজেকে দক্ষ ও স্বনির্ভর হিসেবে গড়ে তুলতে পারে।', 4),
('about_why_heading', 'text', 'about', 'why_us', 'কেন আমরা হেডিং', 'কেন An-Nur Academy?', 1),
('about_why_description', 'textarea', 'about', 'why_us', 'কেন আমরা বর্ণনা', 'আমরা শুধু কোর্স বিক্রি করি না—আমরা স্কিল তৈরি করি। প্রতিটি কোর্স এমনভাবে সাজানো যাতে একদম নতুনরাও ধাপে ধাপে শিখতে পারে। এখানে কোনো জটিল তত্ত্ব নেই, আছে শুধু বাস্তব কাজ আর বাস্তব ফলাফল।', 2);

-- Contact page content
INSERT INTO public.site_content (content_key, content_type, page, section, label, value, sort_order) VALUES
('contact_hero_quote', 'textarea', 'contact', 'hero', 'হিরো উক্তি', '"শিক্ষার আলো দিয়ে আমরা তৈরি করছি আগামীর দক্ষ প্রজন্ম"', 1),
('contact_guidelines_heading', 'text', 'contact', 'guidelines', 'গাইডলাইন হেডিং', 'যোগাযোগের আগে জেনে নিন', 2),
('contact_guidelines_description', 'textarea', 'contact', 'guidelines', 'গাইডলাইন বর্ণনা', 'আমরা সবসময় আপনার পাশে আছি। তবে দ্রুত সাহায্য পেতে নিচের নির্দেশনাগুলো অনুসরণ করুন:', 3),
('contact_email', 'text', 'contact', 'contact_info', 'ইমেইল', 'nuralam0318@gmail.com', 1),
('contact_telegram', 'text', 'contact', 'contact_info', 'টেলিগ্রাম', 'https://t.me/an_nur1', 2),
('contact_facebook', 'text', 'contact', 'contact_info', 'ফেসবুক', 'https://facebook.com/annuracademy', 3),
('contact_youtube', 'text', 'contact', 'contact_info', 'ইউটিউব', 'https://www.youtube.com/@An-Nur_Academy', 4);

INSERT INTO public.site_content (content_key, content_type, page, section, label, json_value, sort_order) VALUES
('contact_guidelines_list', 'json', 'contact', 'guidelines', 'গাইডলাইন লিস্ট', '[
  "কোর্স সম্পর্কিত প্রশ্ন থাকলে প্রথমে FAQ দেখুন",
  "টেকনিক্যাল সমস্যার জন্য স্ক্রিনশট সহ মেসেজ করুন",
  "পেমেন্ট সংক্রান্ত সমস্যার জন্য ট্রানজেকশন আইডি দিন",
  "অফিস আওয়ার: সকাল ১০টা - রাত ১০টা (শুক্রবার ছাড়া)"
]', 4),
('contact_faq', 'json', 'contact', 'faq', 'FAQ লিস্ট', '[
  {"question": "কোর্স কেনার পর কতদিনের মধ্যে অ্যাক্সেস পাবো?", "answer": "পেমেন্ট কনফার্ম হওয়ার পর সাধারণত ১-২ ঘণ্টার মধ্যে আপনি কোর্সে অ্যাক্সেস পেয়ে যাবেন।"},
  {"question": "কোর্সের মেয়াদ কতদিন?", "answer": "আমাদের সব কোর্সে লাইফটাইম অ্যাক্সেস দেওয়া হয়। একবার কিনলে সারাজীবন দেখতে পারবেন।"},
  {"question": "মোবাইল দিয়ে কি কোর্স করা যাবে?", "answer": "হ্যাঁ, আমাদের প্ল্যাটফর্ম সম্পূর্ণ মোবাইল ফ্রেন্ডলি। যেকোনো ডিভাইস থেকে কোর্স করতে পারবেন।"},
  {"question": "কোর্স শেষ করলে কি সার্টিফিকেট পাবো?", "answer": "হ্যাঁ, সফলভাবে কোর্স সম্পন্ন করলে আপনি একটি সার্টিফিকেট পাবেন।"},
  {"question": "রিফান্ড পলিসি কী?", "answer": "আমাদের বিস্তারিত রিফান্ড পলিসি জানতে রিফান্ড পলিসি পেজ দেখুন।"}
]', 1);