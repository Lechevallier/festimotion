import { useState, useEffect } from 'react';
import type { MapViewport } from '../types';

const DEFAULT_VIEWPORT: MapViewport = {
  latitude: 40,
  longitude: 0,
  zoom: 2
};

export function useGeolocation() {
  const [viewport, setViewport] = useState<MapViewport>(DEFAULT_VIEWPORT);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setViewport({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 7
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  return { viewport, setViewport };
}