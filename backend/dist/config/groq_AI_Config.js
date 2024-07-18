import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});
async function getGroqChatCompletion(message) {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: message
            }
        ],
        "model": "llama3-8b-8192",
        "max_tokens": 250,
        "top_p": 1,
        //"stream": true,
    });
}
export { getGroqChatCompletion };
//# sourceMappingURL=groq_AI_Config.js.map