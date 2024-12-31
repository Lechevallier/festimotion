import { Map, Heart, Calendar } from 'lucide-react';

interface FooterProps {
  currentView: 'explore' | 'favorites' | 'my-events';
  onViewChange: (view: 'explore' | 'favorites' | 'my-events') => void;
  isAuthenticated: boolean;
}

export default function Footer({ currentView, onViewChange, isAuthenticated }: FooterProps) {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-around py-2">
          <button
            onClick={() => onViewChange('explore')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
              currentView === 'explore'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Map className="w-5 h-5" />
            <span>Explore</span>
          </button>
          {isAuthenticated && (
            <>
              <button
                onClick={() => onViewChange('favorites')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                  currentView === 'favorites'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span>Favorites</span>
              </button>
              <button
                onClick={() => onViewChange('my-events')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                  currentView === 'my-events'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span>My Events</span>
              </button>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}