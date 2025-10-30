import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// This is a Vercel Serverless Function, accessible at /api/generate
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, images } = req.body;
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'API_KEY environment variable not set.' });
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  interface ImagePayload {
    mimeType: string;
    data: string;
  }

  try {
    const parts: ({ text: string } | { inlineData: ImagePayload })[] = [];

    if (images && Array.isArray(images) && images.length > 0) {
      images.forEach((image: ImagePayload) => {
        parts.push({
          inlineData: {
            mimeType: image.mimeType,
            data: image.data,
          },
        });
      });
    }

    parts.push({ text: prompt || '' });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: parts },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (part) => !!part.inlineData
    );

    if (imagePart?.inlineData) {
      const base64ImageBytes: string = imagePart.inlineData.data;
      const mimeType = imagePart.inlineData.mimeType;
      const imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
      return res.status(200).json({ imageUrl });
    }

    if (response.text) {
        throw new Error(`Model did not return an image. Response: "${response.text}"`);
    }
    if (response.promptFeedback?.blockReason) {
        throw new Error(`Request was blocked: ${response.promptFeedback.blockReason}.`);
    }

    throw new Error("No image data found in the API response.");

  } catch (error) {
    console.error("Error calling Gemini API on server:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return res.status(500).json({ error: errorMessage });
  }
}
