import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptForm } from './components/PromptForm';
import { ImageDisplay } from './components/ImageDisplay';
import { generateImage } from './services/geminiService';

const MAX_IMAGES = 3;

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleImageUpload = useCallback((file: File) => {
    if (uploadedImages.length >= MAX_IMAGES) {
        setError(`You can upload a maximum of ${MAX_IMAGES} images.`);
        return;
    }
    if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (PNG, JPEG, etc.).');
        return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
        setUploadedImages(prev => [...prev, reader.result as string]);
        setError(null); // Clear previous errors on new upload
    };
    reader.onerror = () => {
        setError('Failed to read the image file.');
    };
    reader.readAsDataURL(file);
    // Fix: Add all dependencies to the useCallback dependency array.
  }, [uploadedImages.length, setError, setUploadedImages]);

  const handleRemoveImage = useCallback((indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  const handleGenerate = useCallback(async (userPrompt: string) => {
    if (!userPrompt && uploadedImages.length === 0) {
      setError("Please provide a prompt or upload an image to start.");
      return;
    }
    if(isLoading) return;

    setIsLoading(true);
    setImageUrl(null);
    setError(null);
    setPrompt(userPrompt);

    try {
      const imagePayloads = uploadedImages.map(imgDataUrl => {
        const parts = imgDataUrl.split(';');
        const mimeTypePart = parts[0];
        const base64Part = parts[1];

        if (mimeTypePart && base64Part && mimeTypePart.startsWith('data:image/')) {
            const mimeType = mimeTypePart.split(':')[1];
            const base64Data = base64Part.split(',')[1];
            return { mimeType, data: base64Data };
        }
        throw new Error("Invalid image format detected in one of the uploaded files.");
      });

      const generatedImageUrl = await generateImage(userPrompt, imagePayloads);
      setImageUrl(generatedImageUrl);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
    // Fix: Add all dependencies to the useCallback dependency array to prevent stale closures.
  }, [isLoading, uploadedImages, setImageUrl, setError, setPrompt, setIsLoading]);

  return (
    <div className="min-h-screen text-gray-200 flex flex-col font-['Inter',_sans-serif] selection:bg-sky-500/30">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 pb-60">
        <ImageDisplay 
          imageUrl={imageUrl} 
          isLoading={isLoading} 
          error={error} 
          prompt={prompt}
        />
      </main>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/10 backdrop-blur-xl border-t border-slate-800/50">
          <div className="max-w-4xl mx-auto">
            <PromptForm 
                onSubmit={handleGenerate} 
                isLoading={isLoading}
                onImageUpload={handleImageUpload}
                onRemoveImage={handleRemoveImage}
                uploadedImages={uploadedImages}
                maxImages={MAX_IMAGES}
            />
            <p className="text-center text-gray-600 text-xs mt-4">Powered by Google Gemini. Create, Combine, Captivate.</p>
          </div>
      </div>
    </div>
  );
};

export default App;