-- Allow public to view all courses (published and draft) on the course listing page
DROP POLICY IF EXISTS "Anyone can view published courses" ON public.courses;

CREATE POLICY "Anyone can view all courses"
ON public.courses
FOR SELECT
TO public
USING (true);
