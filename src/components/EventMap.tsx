import { useState } from 'react';
import { Marker, Popup } from 'react-map-gl';
import Map from 'react-map-gl';
import type { Event, MapViewport } from '../types';
import EventMarker from './EventMarker';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface EventMapProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  viewport: MapViewport;
  onViewportChange: (newViewport: MapViewport) => void;
}

export default function EventMap({ events, onEventClick, viewport, onViewportChange }: EventMapProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <div className="flex-1 relative">
      <Map
        {...viewport}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMove={evt => onViewportChange(evt.viewState)}
      >
        {events.map((event) => (
          <Marker
            key={event.id}
            latitude={event.latitude}
            longitude={event.longitude}
          >
            <EventMarker
              event={event}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEvent(event);
                onEventClick(event);
              }}
            />
          </Marker>
        ))}

        {selectedEvent && (
          <Popup
            latitude={selectedEvent.latitude}
            longitude={selectedEvent.longitude}
            onClose={() => setSelectedEvent(null)}
            closeButton={true}
            closeOnClick={false}
            className="max-w-sm"
          >
            <div className="p-2">
              <h3 className="font-bold">{selectedEvent.title}</h3>
              <p className="text-sm text-gray-600">{selectedEvent.description}</p>
              {selectedEvent.image_url && (
                <img
                  src={selectedEvent.image_url}
                  alt={selectedEvent.title}
                  className="w-full h-32 object-cover rounded-lg mt-2"
                />
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}