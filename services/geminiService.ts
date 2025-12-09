import { GoogleGenAI } from "@google/genai";
import { Trader } from "../types";

// In a real app, this would be in an environment variable.
// For the purpose of this generated code, we assume it's available or handled safely.
const API_KEY = process.env.API_KEY || ''; 

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const analyzeTrader = async (trader: Trader): Promise<string> => {
  if (!ai) {
    return "Gemini API Key is missing. Please configure the environment.";
  }

  try {
    const prompt = `
      You are a professional financial analyst for FindTrader India. 
      Analyze the following verified trader's profile and provide a brief, 3-sentence summary of their performance quality, risk management (implied by Profit Factor and Win Rate), and suitability for investors.
      
      Trader Name: ${trader.name}
      Strategy: ${trader.strategy}
      Win Rate: ${trader.winRate}%
      Profit Factor: ${trader.profitFactor}
      Monthly Gain: ${trader.monthlyGain}%
      Avg Risk/Reward: ${trader.avgRR}
      
      Keep it professional, encouraging but realistic.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Analysis unavailable.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Unable to generate analysis at this time.";
  }
};