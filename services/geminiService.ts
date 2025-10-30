interface ImagePayload {
  mimeType: string;
  data: string;
}

export const generateImage = async (prompt: string, images?: ImagePayload[]): Promise<string> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, images }),
    });

    const result = await response.json();

    if (!response.ok) {
      // The error from the serverless function is in result.error
      throw new Error(result.error || `Request failed with status ${response.status}`);
    }

    if (result.imageUrl) {
      return result.imageUrl;
    }

    throw new Error("Invalid response from server.");

  } catch (error) {
    console.error("Error generating image:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};
