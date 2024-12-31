import { endOfDay, isWithinInterval, startOfDay } from 'date-fns';
import { useState } from 'react';
import DateFilter from '../components/DateFilter';
import EventCalendar from '../components/EventCalendar';
import EventList from '../components/EventList';
import EventMap from '../components/EventMap';
import ViewToggle from '../components/ViewToggle';
import { useGeolocation } from '../hooks/useGeolocation';
import type { Event } from '../types';

interface ExplorePageProps {
  events: Event[];
  favorites?: Set<string>;
  onToggleFavorite?: (eventId: string) => void;
}

export default function ExplorePage({ events, favorites, onToggleFavorite }: ExplorePageProps) {
  const [displayMode, setDisplayMode] = useState<'map' | 'list' | 'calendar'>('map');
    const [dateFilter, setDateFilter] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  const { viewport, setViewport } = useGeolocation();

  const filteredEvents = events.filter(event => {
    if (!dateFilter.start || !dateFilter.end) return true;
    
    const eventDate = new Date(event.start_date);
    return isWithinInterval(eventDate, {
      start: startOfDay(dateFilter.start),
      end: endOfDay(dateFilter.end)
    });
  });

  return (
    <>
      <div className="absolute top-2 left-2 z-10">
        <DateFilter onFilterChange={setDateFilter} />
      </div>
      <ViewToggle view={displayMode} onChange={setDisplayMode} />
      {displayMode === 'map' ? (
        <EventMap
          events={filteredEvents}
          onEventClick={(event) => console.log('Event clicked:', event)}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          viewport={viewport}
          onViewportChange={setViewport}
        />
      ) : displayMode === 'list' ? (
        <EventList
          events={filteredEvents}
          onEventClick={(event) => console.log('Event clicked:', event)}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
      ) : (
        <EventCalendar
          events={filteredEvents}
          onEventClick={(event) => console.log('Event clicked:', event)}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </>
  );
}
