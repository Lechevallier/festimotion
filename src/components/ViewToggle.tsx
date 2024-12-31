import { Map, List } from 'lucide-react';

interface ViewToggleProps {
  view: 'map' | 'list';
  onChange: (view: 'map' | 'list') => void;
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-md">
      <div className="p-1 flex">
        <button
          onClick={() => onChange('map')}
          className={`p-2 rounded-md ${
            view === 'map'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          title="Map View"
        >
          <Map className="w-5 h-5" />
        </button>
        <button
          onClick={() => onChange('list')}
          className={`p-2 rounded-md ${
            view === 'list'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          title="List View"
        >
          <List className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}