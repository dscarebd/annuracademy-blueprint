-- Create function to handle enrollment creation on order approval
CREATE OR REPLACE FUNCTION public.handle_order_approval()
RETURNS TRIGGER AS $$
DECLARE
    order_items jsonb;
    item jsonb;
    course_record record;
    user_record record;
BEGIN
    -- Only proceed if status changed to 'কনফার্মড'
    IF NEW.status = 'কনফার্মড' AND (OLD.status IS NULL OR OLD.status != 'কনফার্মড') THEN
        
        -- Find user by email
        SELECT id INTO user_record
        FROM auth.users
        WHERE email = LOWER(NEW.customer_email)
        LIMIT 1;
        
        -- If user exists, create enrollments
        IF user_record.id IS NOT NULL THEN
            order_items := NEW.items;
            
            -- Loop through each item in the order
            FOR item IN SELECT * FROM jsonb_array_elements(order_items)
            LOOP
                -- Find the course by id
                SELECT id INTO course_record
                FROM public.courses
                WHERE id::text = item->>'id'
                LIMIT 1;
                
                -- If course found, create enrollment (if not already exists)
                IF course_record.id IS NOT NULL THEN
                    INSERT INTO public.enrollments (user_id, course_id, order_id, enrolled_at)
                    VALUES (user_record.id, course_record.id, NEW.id, NOW())
                    ON CONFLICT DO NOTHING;
                    
                    RAISE LOG 'Created enrollment for user % in course %', user_record.id, course_record.id;
                END IF;
            END LOOP;
            
            RAISE LOG 'Enrollments created for order %', NEW.order_number;
        ELSE
            RAISE LOG 'No user found with email % for order %', NEW.customer_email, NEW.order_number;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for order approval
DROP TRIGGER IF EXISTS on_order_approval ON public.orders;
CREATE TRIGGER on_order_approval
    AFTER UPDATE OF status ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_order_approval();

-- Add unique constraint on enrollments to prevent duplicates
ALTER TABLE public.enrollments 
DROP CONSTRAINT IF EXISTS enrollments_user_course_unique;

ALTER TABLE public.enrollments 
ADD CONSTRAINT enrollments_user_course_unique UNIQUE (user_id, course_id);