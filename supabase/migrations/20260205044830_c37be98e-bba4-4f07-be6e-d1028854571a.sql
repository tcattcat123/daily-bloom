-- Create teams table
CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL DEFAULT 'Команда',
    activity TEXT NOT NULL,
    leader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team members table
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(team_id, user_id)
);

-- Enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Teams policies: anyone can view, authenticated can create
CREATE POLICY "Anyone can view teams"
ON public.teams FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create teams"
ON public.teams FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = leader_id);

CREATE POLICY "Leaders can update their teams"
ON public.teams FOR UPDATE
TO authenticated
USING (auth.uid() = leader_id);

CREATE POLICY "Leaders can delete their teams"
ON public.teams FOR DELETE
TO authenticated
USING (auth.uid() = leader_id);

-- Team members policies: anyone can view, authenticated can join/leave
CREATE POLICY "Anyone can view team members"
ON public.team_members FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can join teams"
ON public.team_members FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave teams"
ON public.team_members FOR DELETE
TO authenticated
USING (auth.uid() = user_id);