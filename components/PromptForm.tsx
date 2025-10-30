import React, { useState, useRef } from 'react';

interface PromptFormProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  onImageUpload: (file: File) => void;
  onRemoveImage: (index: number) => void;
  uploadedImages: string[];
  maxImages: number;
}

export const PromptForm: React.FC<PromptFormProps> = ({ onSubmit, isLoading, onImageUpload, onRemoveImage, uploadedImages, maxImages }) => {
  const [prompt, setPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(prompt.trim());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
    e.target.value = ''; // Allow re-uploading the same file
  };

  const hasContent = !!prompt.trim() || uploadedImages.length > 0;
  const canUploadMore = uploadedImages.length < maxImages;

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/60 backdrop-blur-lg border border-slate-700 rounded-xl p-2.5 shadow-2xl shadow-black/30 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
            {uploadedImages.map((imgSrc, index) => (
                <div key={index} className="relative group w-14 h-14 flex-shrink-0">
                    <img src={imgSrc} alt={`Upload preview ${index + 1}`} className="w-full h-full object-cover rounded-lg border-2 border-slate-600" />
                    <button
                        type="button"
                        onClick={() => onRemoveImage(index)}
                        className="absolute -top-1.5 -right-1.5 bg-slate-800 hover:bg-red-600 text-white rounded-full p-0.5 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label="Remove image"
                        disabled={isLoading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            ))}
            {canUploadMore && (
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-slate-800/50 hover:bg-slate-700/80 disabled:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 text-slate-400 rounded-lg transition-colors border-2 border-dashed border-slate-600 hover:border-sky-500 hover:text-sky-400"
                    aria-label="Add an image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </button>
            )}
        </div>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your vision, e.g., 'a cat in a spacesuit on Mars'"
        className="w-full h-14 p-3 bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none text-base"
        disabled={isLoading}
      />
      <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          disabled={isLoading || !canUploadMore}
        />
      <button
        type="submit"
        disabled={isLoading || !hasContent}
        className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-sky-500/50"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate'
        )}
      </button>
    </form>
  );
};