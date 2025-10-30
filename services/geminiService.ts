import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface ImagePayload {
  mimeType: string;
  data: string;
}

export const generateImage = async (prompt: string, images?: ImagePayload[]): Promise<string> => {
  try {
    const parts: ({ text: string } | { inlineData: ImagePayload })[] = [];

    if (images && images.length > 0) {
      images.forEach(image => {
        parts.push({
          inlineData: {
            mimeType: image.mimeType,
            data: image.data,
          },
        });
      });
    }
    
    // Add prompt even if it's empty, as the model can still use the image(s)
    parts.push({ text: prompt });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // "Nano Banana"
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Find the image part in the response candidates
    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (part) => !!part.inlineData
    );

    if (imagePart?.inlineData) {
      const base64ImageBytes: string = imagePart.inlineData.data;
      const mimeType = imagePart.inlineData.mimeType;
      return `data:${mimeType};base64,${base64ImageBytes}`;
    }

    // If no image is found, determine the cause of failure.
    // The model may have responded with text instead of an image.
    if (response.text) {
      throw new Error(`Model did not return an image. Response: "${response.text}"`);
    }

    // Check for safety violations or other reasons for blocking.
    if (response.promptFeedback?.blockReason) {
      throw new Error(
        `Request was blocked: ${response.promptFeedback.blockReason}.`
      );
    }
    
    // Fallback for an unexpected response structure.
    throw new Error("No image data found in the API response, and no other error information was available.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Re-throw the specific error to be handled by the UI.
    if (error instanceof Error) {
        throw error;
    }
    // For non-Error objects thrown.
    throw new Error("An unknown error occurred while generating the image.");
  }
};
