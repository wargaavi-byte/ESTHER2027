sql
-- Create the participants table
CREATE TABLE participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  country TEXT NOT NULL,
  fast_duration TEXT NOT NULL, -- e.g., 'Full Fast (Dawn to Nightfall)', 'Half Day', 'Custom'
  video_url TEXT,
  language TEXT DEFAULT 'en'
);

-- Enable Row Level Security (RLS)
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Allow public visitors to read the count and entries
CREATE POLICY "Allow public read access" 
ON participants FOR SELECT 
USING (true);

-- Allow public visitors to submit a new registration
CREATE POLICY "Allow public insert access" 
ON participants FOR INSERT 
WITH CHECK (true);

-- Create an index to keep the 15-million-row counter instantaneous
CREATE INDEX idx_participants_created_at ON participants(created_at);