
-- Remove overly permissive INSERT policy on orders (orders are created via edge function with service role)
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

-- Add admin oversight on profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
