import { GoogleGenAI } from "@google/genai";
import { ScoreAnalysis, Category } from '../types';

const getGeminiClient = () => {
    // Note: In a real production app, this should be a backend call to hide the key.
    // For this frontend-only demo, we use the env var directly.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API Key is missing. AI analysis will not work.");
      return null;
    }
    return new GoogleGenAI({ apiKey });
};

export const generateIQAnalysis = async (
  score: number,
  breakdown: Record<Category, { correct: number; total: number }>
): Promise<string> => {
  const client = getGeminiClient();
  if (!client) return "عذراً، خدمة التحليل الذكي غير متوفرة حالياً (مفتاح API مفقود).";

  const breakdownText = Object.entries(breakdown)
    .map(([cat, val]) => `${cat}: ${val.correct}/${val.total}`)
    .join(", ");

  const prompt = `
    أنت خبير في علم النفس وقياس الذكاء.
    قام مستخدم بإجراء اختبار ذكاء بسيط وحصل على نتيجة إجمالية ${score}/20.
    تفاصيل الأداء حسب القسم:
    ${breakdownText}

    قم بكتابة تحليل نفسي موجز (حوالي 100-150 كلمة) باللغة العربية.
    وجه الحديث للمستخدم بصيغة "أنت".
    1. قيم مستواه العام بناءً على الدرجة.
    2. اذكر نقاط قوته (الأقسام التي حصل فيها على درجة كاملة أو عالية).
    3. قدم نصيحة واحدة لتطوير نقاط الضعف (الأقسام ذات الدرجات المنخفضة).
    لا تذكر أرقام الـ IQ بشكل قاطع، بل استخدم عبارات وصفية مثل "مستوى متميز"، "مستوى جيد"، إلخ.
  `;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "لم يتم استلام رد من الذكاء الاصطناعي.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "حدث خطأ أثناء توليد التحليل. يرجى المحاولة لاحقاً.";
  }
};
