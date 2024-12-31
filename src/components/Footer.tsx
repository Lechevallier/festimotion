import { Map, Plus, User } from 'lucide-react';

interface FooterProps {
  onExplore: () => void;
  onCreateEvent: () => void;
  onProfile: () => void;
  currentView: 'explore' | 'create' | 'profile';
}

export default function Footer({ onExplore, onCreateEvent, onProfile, currentView }: FooterProps) {
  const getButtonClasses = (view: string) => `
    flex flex-col items-center space-y-1
    ${currentView === view ? 'text-blue-600' : 'text-gray-600'}
  `;

  return (
    <footer className="bg-white border-t border-gray-200 sticky bottom-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={onExplore}
            className={getButtonClasses('explore')}
          >
            <Map className="w-6 h-6" />
            <span className="text-xs">Explore</span>
          </button>
          
          <button
            onClick={onCreateEvent}
            className={getButtonClasses('create')}
          >
            <Plus className="w-6 h-6" />
            <span className="text-xs">Create</span>
          </button>
          
          <button
            onClick={onProfile}
            className={getButtonClasses('profile')}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">You</span>
          </button>
        </div>
      </div>
    </footer>
  );
}