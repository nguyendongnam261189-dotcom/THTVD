import { GoogleGenAI } from "@google/genai";
import { getClubs, getPosts } from "./storage";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const buildSystemInstruction = (): string => {
  const clubs = getClubs();
  const recentPosts = getPosts().slice(0, 10); // Context of 10 recent posts

  const clubData = clubs.map(c => `- CLB: ${c.name} (${c.description})`).join("\n");
  const postData = recentPosts.map(p => `- Bài đăng: "${p.title}" của ${p.authorName} trong ${p.clubId}. Nội dung: ${p.content}`).join("\n");

  return `
Bạn là Trợ lý AI của Cổng thông tin Trường Tiểu học Trần Văn Dư.
Nhiệm vụ của bạn là hỗ trợ giáo viên và học sinh tìm kiếm tài liệu, ý tưởng hoạt động CLB.

DỮ LIỆU HIỆN CÓ:
${clubData}

BÀI ĐĂNG MỚI NHẤT:
${postData}

HƯỚNG DẪN:
1. Gợi ý các ý tưởng bài đăng mới cho các CLB nếu được hỏi.
2. Tóm tắt nội dung các tài liệu nếu người dùng hỏi về chủ đề cụ thể.
3. Luôn trả lời lịch sự, ngôn ngữ trong sáng, phù hợp với môi trường tiểu học (gọi là "các con", "các em học sinh").
4. Nếu người dùng muốn viết một bài đăng, hãy giúp họ soạn thảo nội dung hấp dẫn, vui tươi.
`;
};

export const generateResponse = async (userMessage: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: buildSystemInstruction(),
      },
    });

    return response.text || "Xin lỗi, tôi không thể trả lời lúc này.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Đang có lỗi kết nối với AI. Vui lòng thử lại sau.";
  }
};