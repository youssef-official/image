import React from 'react';
import { Loader } from './Loader';

interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  prompt: string;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, isLoading, error, prompt }) => {
  const containerClasses = "w-full aspect-square max-w-2xl bg-slate-900/40 rounded-2xl border border-slate-800 flex flex-col items-center justify-center p-4 text-center transition-all duration-500 relative overflow-hidden shadow-2xl shadow-black/40 backdrop-blur-sm";
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader />
          <p className="mt-4 text-gray-300 font-medium">Conjuring your vision...</p>
          {prompt && <p className="mt-1 text-sm text-gray-500 truncate w-full px-4">{`"${prompt}"`}</p>}
        </>
      );
    }
    if (error) {
      return (
         <div className="text-red-400 space-y-2 animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="font-semibold">Generation Failed</p>
            <p className="text-sm text-red-500 max-w-md">{error}</p>
         </div>
      );
    }
    if (imageUrl) {
      return (
        <img 
          src={imageUrl} 
          alt={prompt} 
          className="w-full h-full object-contain rounded-lg animate-fade-in" 
        />
      );
    }
    return (
        <div className="text-gray-500 space-y-4 flex flex-col items-center justify-center animate-fade-in">
            <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute w-full h-full border-2 border-slate-700/50 rounded-full animate-ping opacity-25"></div>
                <div className="absolute w-3/4 h-3/4 border-2 border-slate-700/50 rounded-full animate-ping [animation-delay:-0.5s] opacity-30"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c.219-.062.45-.094.69-.094h2.12c.24 0 .471.032.69.094m-3.5 0c.219-.062.45-.094.69-.094h2.12c.24 0 .471.032.69.094m0 0c.219.062.45.094.69.094h2.12c.24 0 .471.032.69.094m-3.5 0c.219.062.45.094.69.094h2.12c.24 0 .471.032.69.094m0 0c.219.062.45.094.69.094h2.12c.24 0 .471.032.69.094m-3.5 0c-.219.062-.45.094-.69.094H9.75c-.24 0-.471.032-.69.094m-3.5 0c.219-.062.45.094.69-.094h2.12c.24 0 .471.032.69.094m7 12.386l-5-2.887M15 14.5l-5 2.887m5-2.887l-2.5.0-2.5 2.887M15 14.5A2.25 2.25 0 0114.34 16.09l-2.5 2.887a2.25 2.25 0 01-2.5 2.887 2.25 2.25 0 01-2.5-2.887l2.5-2.887A2.25 2.25 0 019.66 14.5h4.68z" />
                </svg>
            </div>
            <p className="font-semibold text-xl text-gray-400">The Fusion Canvas</p>
            <p className="text-sm max-w-sm">Upload images and describe your vision. Let AI craft a unique visual masterpiece for you.</p>
        </div>
    );
  };
  
  return <div className={containerClasses}>{renderContent()}</div>;
};