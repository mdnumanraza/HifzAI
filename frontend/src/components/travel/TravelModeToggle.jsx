import React, { useState } from 'react';
import useTravelModeStore from '../../store/useTravelModeStore';
import TravelModeConfigModal from './TravelModeConfigModal';

// Simple headphones icon (can be replaced with a proper icon component)
const HeadphonesIcon = ({ className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 3a9 9 0 00-9 9v5a3 3 0 003 3h2a2 2 0 002-2v-3a2 2 0 00-2-2H5v-1a7 7 0 1114 0v1h-3a2 2 0 00-2 2v3a2 2 0 002 2h2a3 3 0 003-3v-5a9 9 0 00-9-9z" />
  </svg>
);

const TravelModeToggle = () => {
  const enabled = useTravelModeStore((s) => s.enabled);
  const stopTravelSession = useTravelModeStore((s) => s.stopTravelSession);
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    if (!enabled) {
      setOpen(true);
    } else {
      stopTravelSession();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2 px-3 py-2 rounded-full transition shadow-sm ${enabled ? 'bg-emerald-600 text-white' : 'bg-white/60 text-emerald-700'} hover:shadow-md`}
        aria-label="Toggle Travel Mode"
      >
        <HeadphonesIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Travel Mode</span>
      </button>
      {open && (
        <TravelModeConfigModal onClose={() => setOpen(false)} />
      )}
    </div>
  );
};

export default TravelModeToggle;
