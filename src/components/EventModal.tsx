import { Heart } from 'lucide-react';
import { format } from 'date-fns';
import Dialog from './Dialog';
import EventLocation from './EventLocation';
import type { Event } from '../types';

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite?: (eventId: string) => void;
  favorites?: Set<string>;
}

export default function EventModal({
  event,
  isOpen,
  onClose,
  onToggleFavorite,
  favorites
}: EventModalProps) {
  if (!event) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={event.title}
    >
      <div className="space-y-4">
        {event.image_url && (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-64 object-cover rounded-lg"
          />
        )}

        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">{event.title}</h3>
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(event.id)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart
                className={`w-6 h-6 ${
                  favorites?.has(event.id)
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-400'
                }`}
              />
            </button>
          )}
        </div>

        <p className="text-gray-600">{event.description}</p>

        <div className="space-y-2 text-sm text-gray-500">
          <div>
            <div className="font-medium text-gray-900">Start</div>
            <div>{format(new Date(event.start_date), 'PPP p')}</div>
          </div>
          
          {event.end_date && (
            <div>
              <div className="font-medium text-gray-900">End</div>
              <div>{format(new Date(event.end_date), 'PPP p')}</div>
            </div>
          )}
        </div>

        <EventLocation
          latitude={event.latitude}
          longitude={event.longitude}
        />

        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Dialog>
  );
}