/*
  # Populate database with sample data

  1. Sample Data
    - Add common event tags
    - Add events with realistic dates and locations
    - Associate events with tags
    - Add some favorite relationships

  2. Data Characteristics
    - Events spread across different dates and locations
    - Mix of single-day and multi-day events
    - Various tags for different event types
    - Some events with multiple tags
*/

-- First, create a system user if not exists
INSERT INTO auth.users (id, email)
VALUES ('00000000-0000-0000-0000-000000000000', 'system@example.com')
ON CONFLICT (id) DO NOTHING;

-- Insert common tags
INSERT INTO tags (name) VALUES
  ('music'),
  ('tech'),
  ('food'),
  ('art'),
  ('sports'),
  ('conference'),
  ('workshop'),
  ('festival'),
  ('networking'),
  ('charity')
ON CONFLICT (name) DO NOTHING;

-- Insert events with various tags
WITH event_inserts AS (
  INSERT INTO events (
    title,
    description,
    image_url,
    latitude,
    longitude,
    start_date,
    end_date,
    user_id
  ) VALUES
    (
      'Summer Music Festival 2024',
      'Three days of amazing music featuring top artists from around the world.',
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80',
      40.7829,
      -73.9654,
      '2024-07-15 16:00:00',
      '2024-07-17 23:00:00',
      '00000000-0000-0000-0000-000000000000'
    ),
    (
      'Tech Innovation Summit',
      'Join industry leaders to discuss the future of technology.',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
      37.7749,
      -122.4194,
      '2024-09-20 09:00:00',
      '2024-09-21 18:00:00',
      '00000000-0000-0000-0000-000000000000'
    ),
    (
      'Food & Wine Festival',
      'Taste exceptional cuisine and wine from renowned chefs.',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80',
      34.0522,
      -118.2437,
      '2024-08-05 11:00:00',
      '2024-08-05 22:00:00',
      '00000000-0000-0000-0000-000000000000'
    ),
    (
      'Modern Art Exhibition',
      'Contemporary art showcase featuring emerging artists.',
      'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?auto=format&fit=crop&q=80',
      51.5074,
      -0.1278,
      '2024-10-01 10:00:00',
      '2024-10-14 18:00:00',
      '00000000-0000-0000-0000-000000000000'
    ),
    (
      'Startup Networking Night',
      'Connect with founders, investors, and tech enthusiasts.',
      'https://images.unsplash.com/photo-1511795409834-432f7b1728f2?auto=format&fit=crop&q=80',
      48.8566,
      2.3522,
      '2024-06-30 18:00:00',
      '2024-06-30 22:00:00',
      '00000000-0000-0000-0000-000000000000'
    ),
    (
      'Charity Marathon',
      'Run for a cause! All proceeds go to local education initiatives.',
      'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80',
      35.6762,
      139.6503,
      '2024-11-10 07:00:00',
      '2024-11-10 15:00:00',
      '00000000-0000-0000-0000-000000000000'
    ),
    (
      'Web Development Workshop',
      'Hands-on workshop covering modern web development practices.',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80',
      52.5200,
      13.4050,
      '2024-07-25 10:00:00',
      '2024-07-25 17:00:00',
      '00000000-0000-0000-0000-000000000000'
    )
  RETURNING id, title
)
-- Associate events with tags
INSERT INTO event_tags (event_id, tag_id)
SELECT 
  e.id,
  t.id
FROM event_inserts e
CROSS JOIN (
  SELECT id, name FROM tags
) t
WHERE 
  (e.title LIKE '%Music%' AND t.name IN ('music', 'festival')) OR
  (e.title LIKE '%Tech%' AND t.name IN ('tech', 'conference', 'networking')) OR
  (e.title LIKE '%Food%' AND t.name IN ('food', 'festival')) OR
  (e.title LIKE '%Art%' AND t.name IN ('art')) OR
  (e.title LIKE '%Networking%' AND t.name IN ('networking', 'tech')) OR
  (e.title LIKE '%Marathon%' AND t.name IN ('sports', 'charity')) OR
  (e.title LIKE '%Workshop%' AND t.name IN ('tech', 'workshop'));

-- Update tag usage counts
UPDATE tags
SET usage_count = (
  SELECT COUNT(*)
  FROM event_tags
  WHERE event_tags.tag_id = tags.id
);
