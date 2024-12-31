import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import TagInput from './TagInput';
import LocationSearch from './LocationSearch';
import ImageUpload from './ImageUpload';
import { useEventForm } from '../hooks/useEventForm';
import { updateEvent } from '../lib/events';
import type { Event, EventFormData } from '../types';
import { FormField } from './FormField';

interface EditEventFormProps {
  event: Event;
  onSuccess: () => void;
}

export default function EditEventForm({ event, onSuccess }: EditEventFormProps) {
  const [error, setError] = useState<string | null>(null);
  const {
    form: {
      register,
      formState: { errors, isSubmitting },
      setValue,
      watch,
      handleSubmit,
      reset
    },
    location,
    setLocation,
    locationError,
    tags,
    setTags,
    validateLocation
  } = useEventForm({ onSuccess });

  const imageUrl = watch('image_url');

  // Initialize form with event data
  useEffect(() => {
    reset({
      title: event.title,
      description: event.description,
      image_url: event.image_url || '',
      start_date: event.start_date.slice(0, 16), // Format for datetime-local input
      end_date: event.end_date?.slice(0, 16) || ''
    });
    setLocation({
      id: 'current',
      text: 'Current Location',
      place_name: 'Current Location',
      center: [event.longitude, event.latitude]
    });
    setTags(event.tags?.map(tag => tag.name) || []);
  }, [event, reset, setLocation, setTags]);

  const onSubmit = async (data: EventFormData) => {
    if (!validateLocation()) return;

    try {
      setError(null);
      await updateEvent(
        {
          ...event,
          ...data,
          latitude: location!.center[1],
          longitude: location!.center[0],
          tags: tags.map(name => ({ name, id: '', usage_count: 0, created_at: '' }))
        },
        event.image_url
      );
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

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
        {isSubmitting ? 'Updating Event...' : 'Update Event'}
      </button>
    </form>
  );
}