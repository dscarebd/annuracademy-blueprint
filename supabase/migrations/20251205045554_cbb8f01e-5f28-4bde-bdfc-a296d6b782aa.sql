-- Create storage bucket for payment method icons
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-icons', 'payment-icons', true);

-- Create storage policies for payment icons bucket
CREATE POLICY "Anyone can view payment icons"
ON storage.objects
FOR SELECT
USING (bucket_id = 'payment-icons');

CREATE POLICY "Admins can upload payment icons"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'payment-icons' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update payment icons"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'payment-icons' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete payment icons"
ON storage.objects
FOR DELETE
USING (bucket_id = 'payment-icons' AND has_role(auth.uid(), 'admin'::app_role));

-- Add icon_url column to payment_methods table
ALTER TABLE public.payment_methods
ADD COLUMN icon_url text;