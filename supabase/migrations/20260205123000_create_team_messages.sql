-- Create team_messages table
CREATE TABLE IF NOT EXISTS public.team_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- NULL means message to whole team, but for now we focus on DMs
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_messages ENABLE ROW LEVEL SECURITY;

-- Policies

-- Allow viewing messages where you are the sender OR the recipient OR it's a public team message and you are a member
CREATE POLICY "Users can view their team messages"
ON public.team_messages FOR SELECT
TO authenticated
USING (
    -- User is sender
    auth.uid() = sender_id
    OR 
    -- User is recipient
    auth.uid() = recipient_id
    OR
    -- Message is for whole team (recipient_id is null) AND user is team member
    (recipient_id IS NULL AND (
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE team_members.team_id = team_messages.team_id
            AND team_members.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM public.teams
            WHERE teams.id = team_messages.team_id
            AND teams.leader_id = auth.uid()
        )
    ))
);

-- Allow sending messages if you are a member of the team
CREATE POLICY "Team members can send messages"
ON public.team_messages FOR INSERT
TO authenticated
WITH CHECK (
    -- User must be sender
    auth.uid() = sender_id
    AND
    -- User must be member of the team OR leader
    (
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE team_members.team_id = team_messages.team_id
            AND team_members.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM public.teams
            WHERE teams.id = team_messages.team_id
            AND teams.leader_id = auth.uid()
        )
    )
);

-- Realtime subscription is enabled by default for tables, but let's ensure it needs to be explicit in some setups.
-- For supabase, usually adding the table to publication is needed for realtime.
-- We can try to add it, but it might fail if user doesn't have superuser which migrations usually run as.
-- assuming standard supabase setup:
alter publication supabase_realtime add table public.team_messages;
