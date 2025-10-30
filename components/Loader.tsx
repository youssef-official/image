
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="w-20 h-20 relative">
      <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-sky-400 rounded-full animate-[orbit_2s_linear_infinite] [animation-delay:-1s]"></div>
      <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-indigo-400 rounded-full animate-[orbit_2s_linear_infinite] [animation-delay:-0.5s]"></div>
      <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-fuchsia-400 rounded-full animate-[orbit_2s_linear_infinite]"></div>
    </div>
  );
};