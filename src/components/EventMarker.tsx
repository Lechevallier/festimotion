import { useState } from 'react';
import type { Event } from '../types';

interface EventMarkerProps {
  event: Event;
  onClick: (e: React.MouseEvent) => void;
}

export default function EventMarker({ event, onClick }: EventMarkerProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`w-12 h-12 rounded-full border-4 border-white shadow-lg overflow-hidden transition-transform duration-200 ${
          isHovered ? 'scale-110' : ''
        }`}
      >
        <img
          src={event.image_url || 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&q=80'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>
      {isHovered && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg p-2 whitespace-nowrap z-10">
          <p className="text-sm font-semibold">{event.title}</p>
        </div>
      )}
    </div>
  );
}