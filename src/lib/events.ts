import { supabase } from './supabase';
import { deleteEventImage } from './storage';
import type { Event } from '../types';

export async function deleteEvent(event: Event) {
  try {
    // Delete the event from the database
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', event.id);

    if (deleteError) throw deleteError;

    // If the event has an image, delete it from storage
    if (event.image_url) {
      await deleteEventImage(event.image_url);
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}