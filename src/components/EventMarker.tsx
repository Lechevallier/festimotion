import { useState, useEffect } from 'react';
import type { Event } from '../types';

interface EventMarkerProps {
  event: Event;
  onClick: (e: React.MouseEvent) => void;
}

export default function EventMarker({ event, onClick }: EventMarkerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const checkIfActive = () => {
      const now = new Date();
      const start = new Date(event.start_date);
      const end = event.end_date ? new Date(event.end_date) : new Date(start.getTime() + (2 * 60 * 60 * 1000)); // Default 2 hours duration
      return now >= start && now <= end;
    };

    setIsActive(checkIfActive());
    
    // Update active status every minute
    const interval = setInterval(() => {
      setIsActive(checkIfActive());
    }, 60000);

    return () => clearInterval(interval);
  }, [event]);

  return (
    <div
      className="cursor-pointer relative"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isActive && (
        <>
          {/* Multiple ripple layers for a more dynamic effect */}
          <div className="absolute inset-[-8px] rounded-full bg-blue-500/10 animate-[ripple_2s_ease-out_infinite]" />
          <div className="absolute inset-[-12px] rounded-full bg-blue-500/10 animate-[ripple_2s_ease-out_infinite_500ms]" />
          <div className="absolute inset-[-16px] rounded-full bg-blue-500/10 animate-[ripple_2s_ease-out_infinite_1000ms]" />
          
          {/* Pulsing glow effect */}
          <div className="absolute inset-[-4px] rounded-full bg-blue-500/20 animate-pulse" />
        </>
      )}
      <div
        className={`
          relative w-12 h-12 rounded-full border-4 shadow-lg overflow-hidden
          transition-all duration-300 ease-out
          ${isHovered ? 'scale-110 border-white' : 'border-white'}
          ${isActive ? 'border-blue-500 shadow-blue-500/50' : ''}
        `}
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
          {isActive && (
            <p className="text-xs text-blue-600 mt-1 font-medium">
              Happening now!
            </p>
          )}
        </div>
      )}
    </div>
  );
}