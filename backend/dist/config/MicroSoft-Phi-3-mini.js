// import { HfInference } from "@huggingface/inference";
export {};
// const HF_TOKEN = process.env.HUGGING_FACE_HF_TOKEN 
// const inference = new HfInference(HF_TOKEN)
// const mistal = inference.endpoint(
//     "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct"
//    );
// async function huggingface(chats: []){
//     const inference = await new HfInference(HF_TOKEN)
//     const out = await inference.chatCompletion({
//         model: "mistralai/Mistral-7B-Instruct-v0.3",
//         messages: [{ role: "user", content: chats }],
//         max_tokens: 200
//     });
//     const fullResponse = out.choices[0].message
// let fullResponse = ''
// for await (const chunk of inference.chatCompletionStream({
//   model: "microsoft/Phi-3-mini-4k-instruct",
//   messages: [
//     {
//       role: "user",
//       content: chats
//     },
//   ],
//   max_tokens: 500,
// })) {
//     if (
//       chunk.choices &&
//       chunk.choices[0].delta &&
//       chunk.choices[0].delta.content
//     ) {
//       fullResponse += chunk.choices[0].delta.content;
//      }       
// }
//     return fullResponse
// }
// export {huggingface}
//# sourceMappingURL=MicroSoft-Phi-3-mini.js.map