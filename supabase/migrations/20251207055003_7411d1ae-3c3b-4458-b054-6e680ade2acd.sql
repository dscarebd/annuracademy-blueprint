-- Create storage bucket for course videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('course-videos', 'course-videos', true, 524288000, ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for course videos
CREATE POLICY "Anyone can view course videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-videos');

CREATE POLICY "Authenticated users can upload course videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'course-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update course videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'course-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete course videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'course-videos' AND auth.role() = 'authenticated');