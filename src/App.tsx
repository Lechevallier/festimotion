import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import EventMap from './components/EventMap';
import EventList from './components/EventList';
import MyEventsList from './components/MyEventsList';
import AddEventForm from './components/AddEventForm';
import SearchBar from './components/SearchBar';
import Layout from './components/Layout';
import AuthForm from './components/AuthForm';
import ViewToggle from './components/ViewToggle';
import Dialog from './components/Dialog';
import { useGeolocation } from './hooks/useGeolocation';
import type { Event } from './types';

export default function App() {
  const [view, setView] = useState<'explore' | 'favorites' | 'my-events'>('explore');
  const [displayMode, setDisplayMode] = useState<'map' | 'list'>('map');
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { viewport, setViewport } = useGeolocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchEvents();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select(`
        *,
        tags:event_tags(
          tag:tags(*)
        )
      `)
      .order('start_date', { ascending: true });
    
    setEvents(data || []);
  };

  const fetchFavorites = async () => {
    const { data } = await supabase
      .from('favorites')
      .select('event_id')
      .eq('user_id', user.id);
    setFavorites(new Set(data?.map(f => f.event_id)));
  };

  const handleSearch = async (query: string) => {
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

  const toggleFavorite = async (eventId: string) => {
    if (!user) return;

    if (favorites.has(eventId)) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', eventId);
      favorites.delete(eventId);
    } else {
      await supabase
        .from('favorites')
        .insert([{ user_id: user.id, event_id: eventId }]);
      favorites.add(eventId);
    }
    setFavorites(new Set(favorites));
  };

  const handleLogin = () => {
    setShowAuthForm(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setFavorites(new Set());
    setView('explore');
  };

  const getDisplayedEvents = () => {
    switch (view) {
      case 'favorites':
        return filteredEvents.filter(event => favorites.has(event.id));
      case 'my-events':
        return filteredEvents.filter(event => event.user_id === user?.id);
      default:
        return filteredEvents;
    }
  };

  const displayedEvents = getDisplayedEvents();

  return (
    <Layout
      view={view}
      onViewChange={setView}
      isAuthenticated={!!user}
      onLogin={handleLogin}
      onLogout={handleLogout}
      onAddEvent={() => setShowAddEvent(true)}
    >
      <SearchBar onSearch={handleSearch} />
      {view === 'my-events' ? (
        <MyEventsList 
          events={displayedEvents}
          onEventDeleted={fetchEvents}
        />
      ) : (
        <>
          <ViewToggle view={displayMode} onChange={setDisplayMode} />
          {displayMode === 'map' ? (
            <EventMap
              events={displayedEvents}
              onEventClick={(event) => console.log('Event clicked:', event)}
              viewport={viewport}
              onViewportChange={setViewport}
            />
          ) : (
            <EventList
              events={displayedEvents}
              onEventClick={(event) => console.log('Event clicked:', event)}
              favorites={favorites}
              onToggleFavorite={user ? toggleFavorite : undefined}
            />
          )}
        </>
      )}

      <Dialog
        isOpen={showAddEvent}
        onClose={() => setShowAddEvent(false)}
        title="Add New Event"
      >
        <AddEventForm
          onSuccess={() => {
            setShowAddEvent(false);
            fetchEvents();
          }}
        />
      </Dialog>

      <Dialog
        isOpen={showAuthForm}
        onClose={() => setShowAuthForm(false)}
        title="Sign In"
      >
        <AuthForm
          onSuccess={() => {
            setShowAuthForm(false);
          }}
        />
      </Dialog>
    </Layout>
  );
}