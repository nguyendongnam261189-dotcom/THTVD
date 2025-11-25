import { GoogleGenAI } from "@google/genai";
import { FESTIVAL_CONTEXT } from '../constants';

const apiKey = process.env.API_KEY || '';

// Safely initialize the AI client
let ai: GoogleGenAI | null = null;
if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
} else {
    console.warn("API_KEY is missing. AI features will not work.");
}

export const generateResponse = async (userMessage: string): Promise<string> => {
    if (!ai) {
        return "Xin lỗi, tôi chưa được kết nối với hệ thống AI (Thiếu API Key).";
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userMessage,
            config: {
                systemInstruction: FESTIVAL_CONTEXT,
                temperature: 0.7,
            }
        });

        return response.text || "Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Đã xảy ra lỗi khi kết nối với máy chủ AI. Vui lòng thử lại.";
    }
};