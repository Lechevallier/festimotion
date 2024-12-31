import { useState, useEffect } from 'react';
import { searchLocation } from '../lib/mapbox';

export function useReverseGeocode(latitude: number, longitude: number) {
  const [location, setLocation] = useState<string>('Loading...');

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const results = await searchLocation(`${longitude},${latitude}`);
        if (results.length > 0) {
          setLocation(results[0].place_name);
        } else {
          setLocation('Location not found');
        }
      } catch (error) {
        console.log(error)
        setLocation('Error loading location');
      }
    };

    fetchLocation();
  }, [latitude, longitude]);

  return location;
}