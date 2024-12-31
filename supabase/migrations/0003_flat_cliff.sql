/*
  # Add tags support

  1. New Tables
    - `tags`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `usage_count` (integer)
      - `created_at` (timestamp)
    - `event_tags`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `tag_id` (uuid, references tags)
      - `created_at` (timestamp)
  
  2. Changes to events table
    - Rename `event_date` to `start_date`
  
  3. Security
    - Enable RLS on new tables
    - Add policies for tag management
*/

-- Create tags table
CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  usage_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Create event_tags junction table
CREATE TABLE event_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events NOT NULL,
  tag_id uuid REFERENCES tags NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, tag_id)
);

-- Rename event_date to start_date if it hasn't been renamed yet
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'events'
    AND column_name = 'event_date'
  ) THEN
    ALTER TABLE events RENAME COLUMN event_date TO start_date;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tags ENABLE ROW LEVEL SECURITY;

-- Tags policies
CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert tags"
  ON tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Event tags policies
CREATE POLICY "Event tags are viewable by everyone"
  ON event_tags FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can manage event tags for their events"
  ON event_tags FOR ALL
  TO authenticated
  USING (
    event_id IN (
      SELECT id FROM events WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    event_id IN (
      SELECT id FROM events WHERE user_id = auth.uid()
    )
  );