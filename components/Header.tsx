import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 right-0 p-4 md:p-6 z-10">
      <div className="max-w-7xl mx-auto flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2a10 10 0 1 0 10 10"/>
            <path d="M22 12a10 10 0 0 0-10-10"/>
            <path d="M12 22a10 10 0 0 0 10-10"/>
            <path d="M2 12a10 10 0 0 0 10 10"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-indigo-400">
          Image Fusion
        </h1>
      </div>
    </header>
  );
};