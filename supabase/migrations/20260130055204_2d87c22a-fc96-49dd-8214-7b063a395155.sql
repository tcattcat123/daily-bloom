-- Enable RLS on habits table
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

-- Users can view their own habits
CREATE POLICY "Users can view their own habits"
  ON public.habits
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own habits
CREATE POLICY "Users can create their own habits"
  ON public.habits
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own habits
CREATE POLICY "Users can update their own habits"
  ON public.habits
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own habits
CREATE POLICY "Users can delete their own habits"
  ON public.habits
  FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS on rituals table
ALTER TABLE public.rituals ENABLE ROW LEVEL SECURITY;

-- Users can view their own rituals
CREATE POLICY "Users can view their own rituals"
  ON public.rituals
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own rituals
CREATE POLICY "Users can create their own rituals"
  ON public.rituals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own rituals
CREATE POLICY "Users can update their own rituals"
  ON public.rituals
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own rituals
CREATE POLICY "Users can delete their own rituals"
  ON public.rituals
  FOR DELETE
  USING (auth.uid() = user_id);