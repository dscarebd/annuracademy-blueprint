-- Create lesson_progress table to track completed lessons
CREATE TABLE public.lesson_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    module_index integer NOT NULL,
    lesson_index integer NOT NULL,
    completed_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, course_id, module_index, lesson_index)
);

-- Enable RLS
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own lesson progress"
ON public.lesson_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lesson progress"
ON public.lesson_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lesson progress"
ON public.lesson_progress FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all lesson progress"
ON public.lesson_progress FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));