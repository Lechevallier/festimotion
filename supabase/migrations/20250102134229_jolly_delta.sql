/*
  # Create storage bucket for event images

  1. New Storage Bucket
    - Create a new public bucket called 'events' for storing event images
    - Enable public access to the bucket
*/

-- Create the storage bucket for event images
INSERT INTO storage.buckets (id, name, public)
VALUES ('events', 'events', true);

-- Create a policy to allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'events' AND
  (storage.foldername(name))[1] = 'event-images'
);

-- Create a policy to allow public access to images
CREATE POLICY "Public can view images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'events');
