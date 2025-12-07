-- Create storage bucket for site content images
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-content', 'site-content', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Site content images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-content');

-- Allow authenticated users to upload (admin check can be done in code)
CREATE POLICY "Authenticated users can upload site content images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'site-content' AND auth.role() = 'authenticated');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update site content images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'site-content' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete site content images"
ON storage.objects FOR DELETE
USING (bucket_id = 'site-content' AND auth.role() = 'authenticated');