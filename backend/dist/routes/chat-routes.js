import { Router } from "express";
import { chatMsgValidator, validate } from "../utils/validators.js";
import { verifyAccessToken } from "../utils/token-manager.js";
import { createChatCompletion, sendAllChats, deleteChats } from "../controllers/chat-controller.js";
const chatRoutes = Router();
// Protected API
chatRoutes.post("/new", validate(chatMsgValidator), verifyAccessToken, createChatCompletion);
chatRoutes.get("/get-all-chats", verifyAccessToken, sendAllChats);
chatRoutes.delete("/delete", verifyAccessToken, deleteChats);
export default chatRoutes;
//# sourceMappingURL=chat-routes.js.map