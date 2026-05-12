
-- ============================================
-- FIX 1: site-content bucket — admin-only writes
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can upload site content" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update site content" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete site content" ON storage.objects;

CREATE POLICY "Admins can upload site content"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-content' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update site content"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'site-content' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete site content"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-content' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- ============================================
-- FIX 2: enrollments — require confirmed order
-- ============================================
DROP POLICY IF EXISTS "Users can create their own enrollments" ON public.enrollments;

CREATE POLICY "Users can create enrollments only with confirmed order"
ON public.enrollments FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND order_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = enrollments.order_id
      AND o.user_id = auth.uid()
      AND o.status = 'কনফার্মড'
      AND EXISTS (
        SELECT 1 FROM jsonb_array_elements(o.items) AS item
        WHERE (item->>'id')::uuid = enrollments.course_id
      )
  )
);

-- ============================================
-- FIX 3: coupons — restrict reads, add validator RPC
-- ============================================
DROP POLICY IF EXISTS "Anyone can view active coupons" ON public.coupons;

-- Only admins can read full coupon rows (Admins can manage coupons policy already covers this via ALL)

-- Public validation function — returns only what's needed to apply discount, no enumeration
CREATE OR REPLACE FUNCTION public.validate_coupon(_code text, _order_amount integer)
RETURNS TABLE (
  id uuid,
  code text,
  discount_type text,
  discount_value integer,
  min_order_amount integer
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c public.coupons%ROWTYPE;
BEGIN
  SELECT * INTO c FROM public.coupons
  WHERE coupons.code = upper(_code) AND coupons.is_active = true
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'কুপন কোড সঠিক নয়';
  END IF;

  IF c.expires_at IS NOT NULL AND c.expires_at < CURRENT_DATE THEN
    RAISE EXCEPTION 'কুপনের মেয়াদ শেষ হয়ে গেছে';
  END IF;

  IF c.max_uses IS NOT NULL AND COALESCE(c.used_count, 0) >= c.max_uses THEN
    RAISE EXCEPTION 'কুপনের ব্যবহার সীমা শেষ';
  END IF;

  IF c.min_order_amount IS NOT NULL AND _order_amount < c.min_order_amount THEN
    RAISE EXCEPTION 'সর্বনিম্ন অর্ডার %৳ হতে হবে', c.min_order_amount;
  END IF;

  RETURN QUERY SELECT c.id, c.code, c.discount_type, c.discount_value, c.min_order_amount;
END;
$$;

-- Allow callers (anon + authenticated) to invoke it
GRANT EXECUTE ON FUNCTION public.validate_coupon(text, integer) TO anon, authenticated;

-- Increment usage securely (no row read needed by client)
CREATE OR REPLACE FUNCTION public.increment_coupon_usage(_coupon_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.coupons
  SET used_count = COALESCE(used_count, 0) + 1
  WHERE id = _coupon_id AND is_active = true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_coupon_usage(uuid) TO anon, authenticated;
