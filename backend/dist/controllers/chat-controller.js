import { User } from "../models/user-model.js";
import { getGroqChatCompletion } from "../config/groq_AI_Config.js";
const createChatCompletion = async (req, res, next) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.send("Message is Required");
        }
        const user = await User.findById(req.user);
        //console.log(user._id);
        //console.log(res.locals.jwtData);
        if (!user) {
            return res.status(401).send("User not Registered");
        }
        //graps Chats of user
        const chats = user.chats.map(({ role, content }) => ({
            role,
            content,
        }));
        chats.push({ role: "user", content: message });
        user.chats.push({ role: "user", content: message });
        // const chatResponse =  await huggingface(message);
        // const model = await geminiAIConfig();
        // const result = await model.generateContent(message);
        // const response = result.response;
        // const text = response.text();
        //console.log(chatResponse);
        /*(async () => {
           const chatCompletion = await getGroqChatCompletion(message);
           let assistantResponse = '';
           for await (const chunk of chatCompletion) {
               const content = chunk.choices[0]?.delta?.content || '';
               assistantResponse += content;
           }
           user.chats.push({ role: "assistant", content: assistantResponse });
           return res.status(200).json({ chats: user.chats });
       })()*/
        const chatCompletion = await getGroqChatCompletion(message);
        const chatResponse = chatCompletion.choices[0]?.message?.content || "";
        user.chats.push({ role: "assistent", content: chatResponse });
        // user.chats.push(chatResponse)
        await user.save();
        return res.status(200).json({ chats: user.chats });
    }
    catch (error) {
        console.log(error.message);
        res
            .status(500)
            .send("Some thing Went wrong while getting the chat response from ApenAI");
    }
};
const sendAllChats = async (req, res) => {
    try {
        //console.log("Login request received:", req.body);
        const userExist = await User.findById(req.user?._id);
        if (!userExist) {
            return res
                .status(401)
                .send("User Does not Registered OR Token malfunctioned ");
        }
        //console.log(userExist);
        //console.log(req.user?._id.toString());
        if (userExist._id.toString() !== req.user?._id.toString()) {
            //console.log("Id Not Correct");
            return res.status(401).send("Permissions didn't match");
        }
        // console.log("HHHHHHH");
        const userLogin = await User.findById(userExist._id).select("-password");
        if (!userLogin) {
            console.log("User Does not found");
        }
        // console.log(userLogin);
        return res.status(200).json({
            chats: userLogin.chats,
            message: "Sending Chats Successfull",
        });
    }
    catch (error) {
        console.error("Error sending the user chats:", error);
        return res
            .status(500)
            .json({
            message: "Something went wrong while sending the user chats",
            error: error.message,
        });
    }
};
const deleteChats = async (req, res) => {
    try {
        //console.log("Login request received:", req.body);
        const userExist = await User.findById(req.user?._id);
        if (!userExist) {
            return res
                .status(401)
                .send("User Does not Registered OR Token malfunctioned ");
        }
        //console.log(userExist);
        //console.log(req.user?._id.toString());
        if (userExist._id.toString() !== req.user?._id.toString()) {
            //console.log("Id Not Correct");
            return res.status(401).send("Permissions didn't match");
        }
        // console.log("HHHHHHH");
        const userLogin = await User.findById(userExist._id).select("-password");
        if (!userLogin) {
            console.log("User Does not found");
        }
        // console.log(userLogin);
        userLogin.chats = [];
        await userLogin.save();
        return res.status(200).json({
            message: "All Chats Deleted Successfull",
        });
    }
    catch (error) {
        console.error("Error sending the user chats:", error);
        return res
            .status(500)
            .json({
            message: "Something went wrong while sending the user chats",
            error: error.message,
        });
    }
};
export { createChatCompletion, sendAllChats, deleteChats };
//# sourceMappingURL=chat-controller.js.map