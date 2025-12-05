-- Create payment_methods table
CREATE TABLE public.payment_methods (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    number text NOT NULL,
    color text NOT NULL DEFAULT 'bg-primary',
    icon text DEFAULT 'wallet',
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Anyone can view active payment methods
CREATE POLICY "Anyone can view active payment methods"
ON public.payment_methods
FOR SELECT
USING (is_active = true);

-- Admins can manage payment methods
CREATE POLICY "Admins can manage payment methods"
ON public.payment_methods
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_payment_methods_updated_at
BEFORE UPDATE ON public.payment_methods
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default payment methods
INSERT INTO public.payment_methods (name, number, color, icon, sort_order) VALUES
('বিকাশ', '01XXXXXXXXX', 'bg-pink-500', 'wallet', 1),
('নগদ', '01XXXXXXXXX', 'bg-orange-500', 'wallet', 2),
('রকেট', '01XXXXXXXXX', 'bg-purple-600', 'wallet', 3);