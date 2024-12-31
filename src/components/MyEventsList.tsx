import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Trash2, AlertCircle } from 'lucide-react';
import type { Event } from '../types';
import EventLocation from './EventLocation';
import { deleteEvent } from '../lib/events';

interface MyEventsListProps {
  events: Event[];
  onEventDeleted: () => void;
}

export default function MyEventsList({ events, onEventDeleted }: MyEventsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (event: Event) => {
    try {
      setDeletingId(event.id);
      setError(null);
      await deleteEvent(event);
      onEventDeleted();
    } catch (err) {
      setError('Failed to delete event. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <Calendar className="w-12 h-12 mb-4" />
        <p className="text-lg">You haven't created any events yet</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      {error && (
        <div className="mx-4 my-2 p-3 bg-red-50 text-red-600 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}
      <div className="max-w-3xl mx-auto space-y-4 p-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-md p-4"
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
              <button
                onClick={() => handleDelete(event)}
                disabled={deletingId === event.id}
                className={`p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors ${
                  deletingId === event.id ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
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