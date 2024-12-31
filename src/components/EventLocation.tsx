import { MapPin } from 'lucide-react';
import { useReverseGeocode } from '../hooks/useReverseGeocode';

interface EventLocationProps {
  latitude: number;
  longitude: number;
}

export default function EventLocation({ latitude, longitude }: EventLocationProps) {
  const location = useReverseGeocode(latitude, longitude);

  return (
    <div className="flex items-center text-sm text-gray-500">
      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
      <span className="truncate">{location}</span>
    </div>
  );
}