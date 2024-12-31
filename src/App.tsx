import 'mapbox-gl/dist/mapbox-gl.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import AuthForm from './components/AuthForm';
import Dialog from './components/Dialog';
import Layout from './components/Layout';
import EventList from './components/EventList';
import MyEventsList from './components/MyEventsList';
import ExplorePage from './pages/ExplorePage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import CreateEventPage from './pages/CreateEventPage';
import type { Event } from './types';

export default function App() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showAuthForm, setShowAuthForm] = useState(false);

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

  const fetchEvents = async () => {
    const now = new Date().toISOString();
    const { data } = await supabase
      .from('events')
      .select(`
        *,
        tags:event_tags(
          tag:tags(*)
        )
      `)
      .gte('end_date', now) // Only get current and future events
      .order('end_date', { ascending: true });
    
    setEvents(data || []);
  };

  const fetchFavorites = async () => {
    const { data } = await supabase
      .from('favorites')
      .select('event_id')
      .eq('user_id', user.id);
    setFavorites(new Set(data?.map(f => f.event_id)));
  };

  const handleLogin = () => setShowAuthForm(true);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setFavorites(new Set());
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

  return (
    <Router>
      <Layout
        isAuthenticated={!!user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      >
        <Routes>
          <Route 
            path="/" 
            element={
              <ExplorePage
                events={events}
                favorites={favorites}
                onToggleFavorite={user ? toggleFavorite : undefined}
              />
            }
          />
          <Route 
            path="/search" 
            element={
              <SearchPage
                events={events}
                favorites={favorites}
                onToggleFavorite={user ? toggleFavorite : undefined}
              />
            }
          />
          <Route 
            path="/profile" 
            element={
              user ? (
                <ProfilePage onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route 
            path="/create" 
            element={
              user ? (
                <CreateEventPage onSuccess={fetchEvents} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route 
            path="/my-events" 
            element={
              user ? (
                <MyEventsList events={events.filter(event => event.user_id === user?.id)} onEventDeleted={fetchEvents} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route 
            path="/favorites" 
            element={
              user ? (
                <EventList
                  events={events.filter(event => favorites.has(event.id))}
                  onEventClick={(event) => console.log('Event clicked:', event)}
                  favorites={favorites}
                  onToggleFavorite={user ? toggleFavorite : undefined}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
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
    </Router>
  );
}