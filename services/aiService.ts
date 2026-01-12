
import { GoogleGenAI } from "@google/genai";
import { MoodState } from "../types";

export const generatePoeticManifesto = async (mood: MoodState): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  
  const emojiStr = mood.emojis.map(e => e.char).join(' ');
  const colorStr = mood.colors.map(c => c.hex).join(', ');

  const prompt = `You are an aesthetic vibe-curator. Create a short, poetic, and slightly abstract 1-sentence manifesto for a mood board.
    
    Mood Context:
    - Title: "${mood.title}"
    - Emojis: ${emojiStr}
    - Colors: ${colorStr}
    
    Guidelines:
    - Language should be evocative, artsy, and modern.
    - Max 100 characters.
    - No hashtags.
    - Do not use the title in the sentence.
    - Example: "A lingering neon echo within a digital silence."`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text?.trim() || "The vibe is currently undefinable.";
  } catch (error) {
    console.error("AI Generation failed:", error);
    return "A silent resonance of color and light.";
  }
};
