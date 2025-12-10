import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the schema for the JSON response
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    transcript: {
      type: Type.ARRAY,
      description: "A diarized transcript of the conversation between the salesperson and the prospect.",
      items: {
        type: Type.OBJECT,
        properties: {
          speaker: { type: Type.STRING, description: "Label like 'Salesperson' or 'Prospect'" },
          text: { type: Type.STRING, description: "The content spoken" },
          timestamp: { type: Type.STRING, description: "Time formatted as MM:SS" },
        },
        required: ["speaker", "text", "timestamp"],
      },
    },
    sentiment: {
      type: Type.ARRAY,
      description: "A series of data points representing the engagement or sentiment level (0-100) throughout the call. Generate at least 15-20 points distributed evenly.",
      items: {
        type: Type.OBJECT,
        properties: {
          time: { type: Type.STRING, description: "Time label corresponding to the point, e.g., '0:30', '1:00'" },
          score: { type: Type.NUMBER, description: "Engagement score from 0 (disengaged/negative) to 100 (highly engaged/positive)" },
        },
        required: ["time", "score"],
      },
    },
    coaching: {
      type: Type.OBJECT,
      description: "Actionable feedback for the salesperson.",
      properties: {
        strengths: {
          type: Type.ARRAY,
          description: "3 specific things the salesperson did well.",
          items: { type: Type.STRING },
        },
        opportunities: {
          type: Type.ARRAY,
          description: "3 specific missed opportunities or areas for improvement.",
          items: { type: Type.STRING },
        },
      },
      required: ["strengths", "opportunities"],
    },
  },
  required: ["transcript", "sentiment", "coaching"],
};

export const analyzeAudio = async (base64Audio: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    const model = "gemini-2.5-flash"; // Optimized for speed and cost for this type of multimodal task

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Audio,
            },
          },
          {
            text: `Analyze this sales call audio recording. 
            Provide a diarized transcript distinguishing between the Salesperson and the Prospect. 
            Generate a sentiment/engagement graph over time. 
            Create a coaching card with 3 key strengths and 3 missed opportunities.
            Return the result strictly as JSON.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini");
    }

    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini:", error);
    throw error;
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:audio/mp3;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to read file as string"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};