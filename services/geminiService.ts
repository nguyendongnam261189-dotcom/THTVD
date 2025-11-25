// services/geminiService.ts

// Hàm này được App.tsx import và dùng như sau:
// const response = await generateResponse(userMsg);

export async function generateResponse(prompt: string): Promise<string> {
  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      console.error("Gemini API returned non-OK status:", res.status);
      return "Xin lỗi, hiện tôi đang gặp lỗi khi kết nối tới AI. Bạn vui lòng thử lại sau nhé.";
    }

    const data = await res.json();

    if (typeof data.text === "string" && data.text.trim().length > 0) {
      return data.text;
    } else if (data.error) {
      console.error("Gemini API error:", data.error);
      return "Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu. Bạn thử hỏi lại theo cách khác giúp tôi nhé.";
    }

    return "Xin lỗi, tôi không nhận được câu trả lời từ AI.";
  } catch (err) {
    console.error("Network or parsing error when calling /api/gemini:", err);
    return "Xin lỗi, có lỗi kết nối khi gọi tới AI. Bạn kiểm tra lại mạng hoặc thử lại sau nhé.";
  }
}
