import { format } from 'date-fns';
import { Calendar, Heart } from 'lucide-react';
import type { Event } from '../types';
import EventLocation from './EventLocation';

interface EventListProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  favorites?: Set<string>;
  onToggleFavorite?: (eventId: string) => void;
}

export default function EventList({ events, onEventClick, favorites, onToggleFavorite }: EventListProps) {
  
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <p className="text-lg">No events yet</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-3xl mx-auto space-y-4 p-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onEventClick(event)}
          >
            {event.image_url && (
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              {onToggleFavorite && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(event.id);
                  }}
                  className="p-2"
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
            <p className="text-gray-600 mt-2">{event.description}</p>
            <div className="flex items-center mt-4 text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{format(new Date(event.start_date), 'PPP')}</span>
            </div>
            <EventLocation 
              latitude={event.latitude}
              longitude={event.longitude}
            />
          </div>
        ))}
      </div>
    </div>
  );
}