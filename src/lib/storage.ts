import { supabase } from './supabase';

export async function uploadEventImage(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `event-images/${fileName}`;

  const { error: uploadError, data } = await supabase.storage
    .from('events')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    throw new Error('Error uploading image');
  }

  const { data: { publicUrl } } = supabase.storage
    .from('events')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteEventImage(imageUrl: string) {
  try {
    // Extract the file path from the URL
    const urlParts = imageUrl.split('/');
    const filePath = `event-images/${urlParts[urlParts.length - 1]}`;

    const { error } = await supabase.storage
      .from('events')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}