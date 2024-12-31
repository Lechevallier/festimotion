import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { searchLocation } from '../lib/mapbox';
import type { Location } from '../types';

interface LocationSearchProps {
  onSelect: (location: Location) => void;
}

export default function LocationSearch({ onSelect }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const locations = await searchLocation(debouncedQuery);
        setResults(locations);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search location');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a location..."
          className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        {loading && (
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {results.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          {results.map((location) => (
            <li
              key={location.id}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                onSelect(location);
                setQuery(location.place_name);
                setResults([]);
              }}
            >
              <div className="font-medium">{location.text}</div>
              <div className="text-sm text-gray-500">{location.place_name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}