import { supabase } from './supabase';
import { deleteEventImage } from './storage';
import type { Event, Tag } from '../types';

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
    throw new Error('Failed to delete event. Please check your connection and try again.');
  }
}

async function updateEventDetails(event: Event) {
  const { error } = await supabase
    .from('events')
    .update({
      title: event.title,
      description: event.description,
      image_url: event.image_url,
      latitude: event.latitude,
      longitude: event.longitude,
      start_date: event.start_date,
      end_date: event.end_date
    })
    .eq('id', event.id);

  if (error) throw error;
}

async function updateEventTags(eventId: string, tags: Tag[]) {
  // First, delete existing tags for this event
  const { error: deleteError } = await supabase
    .from('event_tags')
    .delete()
    .eq('event_id', eventId);

  if (deleteError) throw deleteError;

  // Process each tag
  for (const tag of tags) {
    // Try to find existing tag
    const { data: existingTag, error: findError } = await supabase
      .from('tags')
      .select('id')
      .eq('name', tag.name)
      .single();

    if (findError && findError.code !== 'PGRST116') throw findError;

    let tagId;

    if (existingTag) {
      // Update existing tag count
      const { error: updateError } = await supabase
        .from('tags')
        .update({ usage_count: supabase.increment(1) })
        .eq('id', existingTag.id);

      if (updateError) throw updateError;
      tagId = existingTag.id;
    } else {
      // Create new tag
      const { data: newTag, error: insertError } = await supabase
        .from('tags')
        .insert({ name: tag.name })
        .select()
        .single();

      if (insertError) throw insertError;
      tagId = newTag?.id;
    }

    if (tagId) {
      // Link tag to event
      const { error: linkError } = await supabase
        .from('event_tags')
        .insert({
          event_id: eventId,
          tag_id: tagId
        });

      if (linkError) throw linkError;
    }
  }
}

export async function updateEvent(event: Event, oldImageUrl?: string) {
  try {
    // Start a transaction by using RLS policies
    await updateEventDetails(event);

    if (event.tags) {
      await updateEventTags(event.id, event.tags);
    }

    // Handle image cleanup if needed
    if (oldImageUrl && oldImageUrl !== event.image_url) {
      await deleteEventImage(oldImageUrl);
    }
  } catch (error) {
    console.error('Error updating event:', error);
    
    // Provide user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('Connection error. Please check your internet connection and try again.');
      }
      if (error.message.includes('permission')) {
        throw new Error('You don\'t have permission to update this event.');
      }
      throw new Error('Failed to update event. Please try again.');
    }
    
    throw new Error('An unexpected error occurred. Please try again.');
  }
}