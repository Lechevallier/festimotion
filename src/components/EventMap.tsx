import { useState, useRef } from 'react';
import { Marker, GeolocateControl, NavigationControl } from 'react-map-gl';
import Map from 'react-map-gl';
import type { Event, MapViewport } from '../types';
import EventMarker from './EventMarker';
import EventModal from './EventModal';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface EventMapProps {
  events: Event[];
  viewport: MapViewport;
  onViewportChange: (newViewport: MapViewport) => void;
  favorites?: Set<string>;
  onToggleFavorite?: (eventId: string) => void;
}

export default function EventMap({
  events,
  viewport,
  onViewportChange,
  favorites,
  onToggleFavorite
}: EventMapProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const geolocateControlRef = useRef<mapboxgl.GeolocateControl>();

  const handleMapLoad = () => {
    if (geolocateControlRef.current) {
      // geolocateControlRef.current.trigger();
    }
  };
  
  return (
    <>
      <Map
        {...viewport}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMove={evt => onViewportChange(evt.viewState)}
        onLoad={handleMapLoad}
      >
        {events.toReversed().map((event) => (
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
              }}
            />
          </Marker>
        ))}

        <GeolocateControl ref={geolocateControlRef} position="bottom-left" />
        <NavigationControl position="bottom-left" />
      </Map>

      <EventModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
      />
    </>
  );
}