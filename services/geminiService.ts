// src/services/geminiService.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { FESTIVAL_CONTEXT, PROJECTS, SCHEDULE } from "../constants";

// ⚠️ Vite không dùng process.env mà dùng import.meta.env
// Trên Vercel / file .env: đặt VITE_GEMINI_API_KEY=...
const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

// Chuẩn bị biến model (nếu không có key thì để null, tránh crash)
let model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null = null;

if (apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  // Có thể đổi model nếu muốn, ví dụ "gemini-2.0-flash"
  model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
} else {
  // Chỉ cảnh báo khi chạy dev, để bản deploy không spam console
  if (import.meta.env.DEV) {
    console.warn("VITE_GEMINI_API_KEY is missing. AI features will not work.");
  }
}

// Tạo system prompt từ dữ liệu FESTIVAL_CONTEXT, PROJECTS, SCHEDULE
const buildSystemInstruction = (): string => {
  const projectData = PROJECTS.map(
    (p) =>
      `- Sản phẩm: "${p.title}" (Lĩnh vực: ${p.category}). Tác giả: ${p.authors}. Mô tả: ${p.description}`
  ).join("\n");

  const scheduleData = SCHEDULE.map(
    (s) =>
      `- Thời gian: ${s.time}. Sự kiện: "${s.title}" tại ${s.location}. Chi tiết: ${s.description}`
  ).join("\n");

  return `${FESTIVAL_CONTEXT}

DƯỚI ĐÂY LÀ DỮ LIỆU CHI TIẾT VỀ GIAN HÀNG TRƯỜNG NGUYỄN BỈNH KHIÊM:

DANH SÁCH SẢN PHẨM TRƯNG BÀY:
${projectData}

LỊCH TRÌNH HOẠT ĐỘNG:
${scheduleData}

LƯU Ý KHI TRẢ LỜI:
1. Bạn là đại diện của trường, hãy trả lời thân thiện, tự hào và ngắn gọn.
2. Chỉ trả lời các thông tin liên quan đến trường Nguyễn Bỉnh Khiêm, gian hàng số 40 và Ngày hội chuyển đổi số.
3. Nếu được hỏi về một sản phẩm cụ thể, hãy trích dẫn tên tác giả và mô tả.
4. Nếu được hỏi về lịch trình, hãy cung cấp giờ và địa điểm chính xác.
`;
};

// Hàm dùng trong App.tsx để gọi AI
export const generateResponse = async (userMessage: string): Promise<string> => {
  // Nếu chưa có model (chưa cấu hình API Key) thì trả lời nhẹ nhàng
  if (!model) {
    return "Xin lỗi, tôi chưa được kết nối với hệ thống AI (thiếu API Key). Vui lòng báo với thầy/cô phụ trách gian hàng kiểm tra cấu hình.";
  }

  try {
    // Gộp system instruction + câu hỏi của khách vào một prompt
    const prompt = `${buildSystemInstruction()}

CÂU HỎI CỦA KHÁCH THAM QUAN:
${userMessage}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text?.trim() || "Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Đã xảy ra lỗi khi kết nối với máy chủ AI. Vui lòng thử lại sau hoặc hỏi trực tiếp thầy cô tại gian hàng.";
  }
};
