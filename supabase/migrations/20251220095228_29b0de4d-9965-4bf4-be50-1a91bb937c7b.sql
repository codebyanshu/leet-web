-- Create members table for LeetCode leaderboard
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  avatar TEXT,
  ranking INTEGER DEFAULT 0,
  total_solved INTEGER DEFAULT 0,
  easy_solved INTEGER DEFAULT 0,
  medium_solved INTEGER DEFAULT 0,
  hard_solved INTEGER DEFAULT 0,
  contest_rating INTEGER DEFAULT 0,
  contest_ranking INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  reputation INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (leaderboard is public)
CREATE POLICY "Members are publicly viewable" 
ON public.members 
FOR SELECT 
USING (true);

-- Create policy for public insert (anyone can add members)
CREATE POLICY "Anyone can add members" 
ON public.members 
FOR INSERT 
WITH CHECK (true);

-- Create policy for public delete (anyone can remove members)
CREATE POLICY "Anyone can delete members" 
ON public.members 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_members_updated_at
BEFORE UPDATE ON public.members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for members table
ALTER PUBLICATION supabase_realtime ADD TABLE public.members;