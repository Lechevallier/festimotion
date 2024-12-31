/*
  # Add sample events with system user

  1. System User
    - Creates a system user for sample data
  2. Sample Data
    - Adds various events around the world
    - Events are linked to the system user
*/

-- First, create a system user in auth.users
INSERT INTO auth.users (id, email)
VALUES ('00000000-0000-0000-0000-000000000000', 'system@example.com')
ON CONFLICT (id) DO NOTHING;

-- Then insert sample events using the system user
INSERT INTO events (title, description, image_url, latitude, longitude, event_date, user_id)
VALUES
  (
    'Tech Conference 2024',
    'Join us for the biggest tech conference of the year! Featuring keynotes from industry leaders and hands-on workshops.',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
    40.7128,
    -74.0060,
    '2024-06-15 09:00:00',
    '00000000-0000-0000-0000-000000000000'
  ),
  (
    'Summer Music Festival',
    'A three-day music festival featuring top artists from around the world. Food, drinks, and amazing vibes!',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80',
    34.0522,
    -118.2437,
    '2024-07-20 18:00:00',
    '00000000-0000-0000-0000-000000000000'
  ),
  (
    'Food & Wine Expo',
    'Experience the finest cuisines and wines from renowned chefs and sommeliers. Tastings, demonstrations, and more!',
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80',
    51.5074,
    -0.1278,
    '2024-08-10 11:00:00',
    '00000000-0000-0000-0000-000000000000'
  ),
  (
    'Art Gallery Opening',
    'Join us for the opening night of our contemporary art exhibition featuring works from emerging artists.',
    'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?auto=format&fit=crop&q=80',
    48.8566,
    2.3522,
    '2024-09-05 19:00:00',
    '00000000-0000-0000-0000-000000000000'
  ),
  (
    'Marathon 2024',
    'Annual city marathon with routes for all skill levels. Register now for early bird pricing!',
    'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80',
    35.6762,
    139.6503,
    '2024-10-01 07:00:00',
    '00000000-0000-0000-0000-000000000000'
  );