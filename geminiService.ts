
import { GoogleGenAI, Type } from '@google/genai';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.STRING,
    description: 'An SEO-friendly product title.',
  },
};

export const generateTitles = async (demoTitle: string, count: number, isThinkingMode: boolean): Promise<string[]> => {
  const modelName = isThinkingMode ? 'gemini-2.5-pro' : 'gemini-flash-lite-latest';
  
  const prompt = `You are an expert in SEO and e-commerce marketing. Based on the following example product title, generate a list of ${count} unique, creative, and highly SEO-friendly alternative product titles. The titles should be catchy and appeal to online shoppers.

Example Title: "${demoTitle}"

Provide the output as a JSON array of strings. Do not include any other text or explanations in your response.`;

  const config = {
    systemInstruction: "You are an expert SEO and e-commerce copywriter. Your task is to generate compelling product titles based on user examples. Output only a valid JSON array of strings.",
    responseMimeType: "application/json",
    responseSchema: responseSchema,
    ...(isThinkingMode && { thinkingConfig: { thinkingBudget: 32768 } })
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config,
    });

    const jsonText = response.text.trim();
    const titles: string[] = JSON.parse(jsonText);
    return titles;
  } catch (error) {
    console.error("Error generating titles with Gemini:", error);
    throw new Error("Failed to generate titles from Gemini API.");
  }
};
