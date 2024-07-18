import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";
import { User } from "../models/user-model.js";
const generateAccessToken = async (_id, email, expiresIn) => {
    try {
        const payload = {
            _id,
            email
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
        return token;
    }
    catch (error) {
        console.log("Enable to GenerateAccess Token", error);
    }
};
const verifyAccessToken = async (req, res, next) => {
    try {
        const token = req.signedCookies[`${COOKIE_NAME}`];
        //console.log(token);
        if (!token || token.trim() === "") {
            throw new Error("Unauthorized Request: No token provided.");
        }
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodeToken?._id).select("-password");
        if (!decodeToken || !user) {
            return res
                .status(401)
                .send("Unauthorized Request: Token Expired or User not found.");
        }
        req.user = user;
        //console.log(req.user);
        next();
    }
    catch (error) {
        console.error("Error in verifyAccessToken:", error);
        return res.status(401).send("Unauthorized Request: Invalid Access Token.");
    }
};
export { generateAccessToken, verifyAccessToken };
//# sourceMappingURL=token-manager.js.map