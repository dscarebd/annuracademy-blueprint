-- =============================================
-- FIX 1: Add user_id to orders table and update RLS
-- =============================================

-- Add user_id column to orders table (nullable to support existing orders)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Drop the old email-based policy
DROP POLICY IF EXISTS "Users can view own orders by email" ON public.orders;

-- Create new user_id based policy for viewing own orders
CREATE POLICY "Users can view own orders by user_id" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

-- =============================================
-- FIX 2: Restrict course-videos storage to admins only
-- =============================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can upload course videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update course videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete course videos" ON storage.objects;

-- Create admin-only policies for upload/update/delete
CREATE POLICY "Admins can upload course videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-videos' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update course videos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'course-videos' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete course videos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-videos' AND 
  has_role(auth.uid(), 'admin'::app_role)
);