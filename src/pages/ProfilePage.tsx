import { LogOut, Heart, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface ProfilePageProps {
  onLogout: () => void;
}

export default function ProfilePage({ onLogout }: ProfilePageProps) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const onFavorites = () => navigate('/favorites');
  const onMyEvents = () => navigate('/my-events');
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  if (!user) return null;

  const isAna = user.email === "lopezfdezana@gmail.com";

  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-4">
          {isAna && <h2 className="text-lg truncate font-medium text-gray-900">
            Hello Anina 🤗❤️
          </h2>}
          <h2 className="text-lg truncate font-medium text-gray-900">
            {user.email}
          </h2>
        </div>

        {isAna && <div className="bg-yellow-100 text-center rounded-lg shadow p-4">
          <h1 className="text-xl uppercase font-medium text-gray-900">
            Golden ticket
          </h1>
          <h2 className="text-[100px] leading-none">
            🎫
          </h2>
          <h2 className="text-sm font-light text-gray-900 pt-4">
            Valid for the concert of your choice
          </h2>
        </div>}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <button
            onClick={onFavorites}
            className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50"
          >
            <Heart className="w-5 h-5 text-gray-500" />
            <span>Favorites</span>
          </button>

          <button
            onClick={onMyEvents}
            className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 border-t"
          >
            <Calendar className="w-5 h-5 text-gray-500" />
            <span>My Events</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 border-t text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}