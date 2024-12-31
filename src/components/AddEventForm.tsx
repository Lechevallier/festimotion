import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import TagInput from './TagInput';
import LocationSearch from './LocationSearch';
import ImageUpload from './ImageUpload';
import { useEventForm } from '../hooks/useEventForm';
import type { EventFormData } from '../lib/validation';
import { FormField } from './FormField';

export default function AddEventForm({ onSuccess }: { onSuccess: () => void }) {
  const navigate = useNavigate();
  const {
    form: {
      register,
      formState: { errors, isSubmitting },
      setValue,
      watch,
      handleSubmit
    },
    location,
    setLocation,
    locationError,
    tags,
    setTags,
    validateLocation
  } = useEventForm({ onSuccess });

  const imageUrl = watch('image_url');

  const onSubmit = async (data: EventFormData) => {
    if (!validateLocation()) return;

    try {
      // 1. Insert the event
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .insert([
          {
            ...data,
            latitude: location!.center[1],
            longitude: location!.center[0],
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        ])
        .select()
        .single();

      if (eventError) throw eventError;

      // 2. Process tags
      if (tags.length > 0) {
        for (const tagName of tags) {
          // Try to insert new tag
          const { data: existingTag } = await supabase
            .from('tags')
            .select('id')
            .eq('name', tagName)
            .single();

          let tagId;

          if (existingTag) {
            await supabase
              .from('tags')
              .update({ usage_count: supabase.sql`usage_count + 1` })
              .eq('id', existingTag.id);
            tagId = existingTag.id;
          } else {
            const { data: newTag } = await supabase
              .from('tags')
              .insert({ name: tagName })
              .select()
              .single();
            tagId = newTag?.id;
          }

          if (tagId) {
            await supabase
              .from('event_tags')
              .insert({
                event_id: eventData.id,
                tag_id: tagId
              });
          }
        }
      }

      navigate('/');
      onSuccess();
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        label="Title"
        error={errors.title?.message}
      >
        <input
          type="text"
          {...register('title')}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </FormField>

      <FormField
        label="Description"
        error={errors.description?.message}
      >
        <textarea
          {...register('description')}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={4}
        />
      </FormField>

      <FormField
        label="Event Image"
        error={errors.image_url?.message}
      >
        <ImageUpload
          value={imageUrl || ''}
          onChange={(url) => setValue('image_url', url)}
        />
      </FormField>

      <FormField
        label="Location"
        error={locationError}
      >
        <LocationSearch onSelect={setLocation} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Start Date"
          error={errors.start_date?.message}
        >
          <input
            type="datetime-local"
            {...register('start_date')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </FormField>

        <FormField
          label="End Date (optional)"
          error={errors.end_date?.message}
        >
          <input
            type="datetime-local"
            {...register('end_date')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </FormField>
      </div>

      <FormField
        label="Tags (up to 10)"
      >
        <TagInput
          value={tags}
          onChange={setTags}
          maxTags={10}
        />
      </FormField>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Adding Event...' : 'Add Event'}
      </button>
    </form>
  );
}