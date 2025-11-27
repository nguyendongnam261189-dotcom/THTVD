import { GoogleGenAI } from "@google/genai";
import { FESTIVAL_CONTEXT, PROJECTS, SCHEDULE } from '../constants';

const apiKey = process.env.API_KEY || '';

// Safely initialize the AI client
let ai: GoogleGenAI | null = null;
if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
} else {
    console.warn("API_KEY is missing. AI features will not work.");
}

// Construct a rich system instruction with dynamic data
const buildSystemInstruction = () => {
    const projectData = PROJECTS.map(p => 
        `- Sản phẩm: "${p.title}" (Lĩnh vực: ${p.category}). Tác giả: ${p.authors}. Mô tả: ${p.description}`
    ).join('\n');

    const scheduleData = SCHEDULE.map(s => 
        `- Thời gian: ${s.time}. Sự kiện: "${s.title}" tại ${s.location}. Chi tiết: ${s.description}`
    ).join('\n');

    return `${FESTIVAL_CONTEXT}

DƯỚI ĐÂY LÀ DỮ LIỆU CHI TIẾT VỀ GIAN HÀNG TRƯỜNG NGUYỄN BỈNH KHIÊM:

DANH SÁCH SẢN PHẨM TRƯNG BÀY:
${projectData}

LỊCH TRÌNH HOẠT ĐỘNG:
${scheduleData}

LƯU Ý KHI TRẢ LỜI:
1. Bạn là đại diện của trường, hãy trả lời thân thiện, tự hào và ngắn gọn.
2. Chỉ trả lời các thông tin liên quan đến trường Nguyễn Bỉnh Khiêm, gian hàng số 17 và Ngày hội chuyển đổi số.
3. Nếu được hỏi về một sản phẩm cụ thể, hãy trích dẫn tên tác giả và mô tả.
4. Nếu được hỏi về lịch trình, hãy cung cấp giờ và địa điểm chính xác.
`;
};

export const generateResponse = async (userMessage: string): Promise<string> => {
    if (!ai) {
        return "Xin lỗi, tôi chưa được kết nối với hệ thống AI (Thiếu API Key).";
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userMessage,
            config: {
                systemInstruction: buildSystemInstruction(),
                temperature: 0.5, // Lower temperature for more accurate factual responses
            }
        });

        return response.text || "Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Đã xảy ra lỗi khi kết nối với máy chủ AI. Vui lòng thử lại.";
    }
};