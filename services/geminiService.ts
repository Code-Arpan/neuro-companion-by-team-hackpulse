
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { TaskStep } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function decomposeTask(goal: string): Promise<Omit<TaskStep, 'id' | 'isCompleted'>[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Break down this task: ${goal}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING, description: "A tiny, 1-2 minute step." },
                  estimatedMinutes: { type: Type.NUMBER, description: "Duration in minutes (usually 1 or 2)." }
                },
                required: ["description", "estimatedMinutes"]
              }
            }
          },
          required: ["steps"]
        }
      }
    });

    const result = JSON.parse(response.text || '{"steps": []}');
    return result.steps;
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback logic if AI fails
    return [
      { description: "Take one deep breath to start.", estimatedMinutes: 1 },
      { description: "Look at your task for 10 seconds.", estimatedMinutes: 1 },
      { description: "Do just one small part of it.", estimatedMinutes: 2 }
    ];
  }
}
