import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import EventList from '../components/EventList';
import type { Event } from '../types';

interface SearchPageProps {
  events: Event[];
  favorites?: Set<string>;
  onToggleFavorite?: (eventId: string) => void;
}

export default function SearchPage({ events, favorites, onToggleFavorite }: SearchPageProps) {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter(event => {
      const matchesTitle = event.title.toLowerCase().includes(query.toLowerCase());
      const matchesTags = event.tags?.some(({ tag }) => 
        tag.name.toLowerCase().includes(query.toLowerCase())
      );
      return matchesTitle || matchesTags;
    });

    setFilteredEvents(filtered);
  };

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center p-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 mx-2">
            <SearchBar onSearch={handleSearch} autoFocus />
          </div>
        </div>
      </div>

      <EventList
        events={filteredEvents}
        onEventClick={() => {}}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
      />
    </div>
  );
}