import { GoogleGenerativeAI } from "@google/generative-ai";
async function geminiAIConfig() {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    return model;
}
export { geminiAIConfig };
//# sourceMappingURL=geminiAI-Config.js.map