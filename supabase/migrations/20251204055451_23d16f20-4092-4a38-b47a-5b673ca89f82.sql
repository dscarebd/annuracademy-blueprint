-- Allow users to view their own orders (by email)
CREATE POLICY "Users can view own orders by email"
ON public.orders
FOR SELECT
USING (
  auth.jwt() ->> 'email' = LOWER(customer_email)
);