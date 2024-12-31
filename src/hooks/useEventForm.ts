import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema, type EventFormData } from '../lib/validation';
import type { Location } from '../types';

export function useEventForm({ onSuccess }: { onSuccess: () => void }) {
  const [location, setLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema)
  });

  const validateLocation = () => {
    if (!location) {
      setLocationError('Location is required');
      return false;
    }
    setLocationError(null);
    return true;
  };

  return {
    form,
    location,
    setLocation,
    locationError,
    tags,
    setTags,
    validateLocation
  };
}