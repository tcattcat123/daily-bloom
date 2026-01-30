-- Create support_rays table
CREATE TABLE public.support_rays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.support_rays ENABLE ROW LEVEL SECURITY;

-- Users can see rays they sent
CREATE POLICY "Users can view rays they sent"
  ON public.support_rays
  FOR SELECT
  USING (auth.uid() = sender_id);

-- Users can see rays they received
CREATE POLICY "Users can view rays they received"
  ON public.support_rays
  FOR SELECT
  USING (auth.uid() = receiver_id);

-- Users can send rays (insert)
CREATE POLICY "Users can send rays"
  ON public.support_rays
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Users can mark their received rays as read
CREATE POLICY "Users can update their received rays"
  ON public.support_rays
  FOR UPDATE
  USING (auth.uid() = receiver_id);

-- Index for faster queries
CREATE INDEX idx_support_rays_receiver ON public.support_rays(receiver_id, is_read);
CREATE INDEX idx_support_rays_sender ON public.support_rays(sender_id);

-- RLS policy for profiles to allow reading nicknames
CREATE POLICY "Anyone can view nicknames"
  ON public.profiles
  FOR SELECT
  USING (true);