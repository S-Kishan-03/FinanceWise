
import { GoogleGenAI } from "@google/genai";

export const getFinancialAdvice = async (scenario: string, data: any) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const prompt = `
      Act as a senior certified financial planner. 
      Analyze the following financial scenario for a user in India.
      Scenario: ${scenario}
      Data Points: ${JSON.stringify(data)}
      
      Provide a concise summary including:
      1. Key observations.
      2. Potential risks.
      3. A recommended strategy to optimize this goal.
      Keep it professional, encouraging, and strictly under 200 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I couldn't generate advice at this moment. Please check your inputs and try again.";
  }
};
