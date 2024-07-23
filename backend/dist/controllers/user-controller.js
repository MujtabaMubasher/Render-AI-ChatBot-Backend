import { User } from "../models/user-model.js";
import { generateAccessToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
const getAllusers = async (req, res, next) => {
    try {
        const users = await User.find();
        return res.status(200).json({ message: "ok", users: users });
    }
    catch (error) {
        console.log(error);
        return res
            .status(401)
            .json({ message: "Error", cause: error.message });
    }
};
const signUp = async (req, res) => {
    const { username, email, password } = req.body;
    if ([username, email, password].some((fields) => !fields || fields?.trim() === "")) {
        return res.status(401).json({ message: "All fields are required" });
    }
    try {
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(401).json({ message: "Email Already Exists" });
        }
        const user = new User({
            username,
            email,
            password,
        });
        await user.save();
        const userCreated = await User.findById(user._id).select("-password");
        if (!userCreated) {
            throw new Error("User creation failed: User not found after creation");
        }
        return res.status(200).json({ message: "Account Created Successfully", user: userCreated });
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Something went wrong while creating the user", error: error.message });
    }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(401).json({messaage: "This email doest not Exist"}); 
    }

    const isPasswordValid = await userExist.isPasswordCorrect(password);
    if (!isPasswordValid) {
     return res.status(401).json({messaage: "Password is Invalid"});
    }

    const accessToken = await generateAccessToken(userExist._id, userExist.email, process.env.ACCESS_TOKEN_EXPIRY);
    if (!accessToken) {
      throw new Error("Failed to generate access token");
    }

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    const cookieOptions = {
      path: "/",
      domain: "render-ai-chat-bot-backend.vercel.app",
      expires,
      httpOnly: true,
      signed: true,
      secure: true,
      sameSite: 'None'
    };

    try {
      await res.cookie(COOKIE_NAME, accessToken, cookieOptions);
    } catch (error) {
      throw new Error(`Error setting cookie: ${error.message}`);
    }

    const userLogin = await User.findById(userExist._id).select("-password");
    return res.status(200).json({
      name: userLogin.username,
      email: userLogin.email,
      message: "Login successful",
    });

  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Something went wrong during login", error: error.message });
  }
};
const verifyUser = async (req, res) => {
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
            console.log("Id Not Correct");
            return res.status(401).send("Permissions didn't match");
        }
        // console.log("HHHHHHH");
        const userLogin = await User.findById(userExist._id).select("-password");
        if (!userLogin) {
            console.log("User Does not found");
        }
        // console.log(userLogin);
        return res.status(200).json({
            name: userLogin.username,
            email: userLogin.email,
            message: "Login Successful",
        });
    }
    catch (error) {
        console.error("Error Login user:", error);
        return res
            .status(500)
            .json({
            message: "Something went wrong while Login the user",
            error: error.message,
        });
    }
};
const logout = async (req, res) => {
    try {
       const options = {
            path: "/",
            domain: "render-ai-chat-bot-backend.vercel.app",
            httpOnly: true,
            secure: true,
            signed: true,
            sameSite: 'None'
           
        }
        // res.clearCookie(COOKIE_NAME, {
        //    httpOnly: true,
        //    domain: "render-ai-chat-bot-backend.vercel.app",
        //    signed: true,
        //    path: "/",
        //    secure: true,
        //    sameSite: 'None'
        // });
      //  res.clearCookie(COOKIE_NAME, options)
        return res
            .status(200)
            .clearCookie(COOKIE_NAME, options)
            .json({message: "Logout Successful"});
    }
    catch (error) {
        console.error("Error Login user:", error);
        return res.status(500).json({ message: "Something went wrong while logout the user", error: error.message });
    }
};
// My code
/*
const signUp = async(req,res) => {
      
      const {username, email, password} = req.body;
      if
      (
        [username,email,password].some(
          (fields)=> fields?.trim() === ""
        )
      ){
         return res.status(401).json({message:"All fields are requireds"})
      }
      try {
      const userExist = await User.findOne({
        $or: [{email}],
      })

      if (userExist) {
        return res.status(401).json({message:"email already exist"})
      }

      
         const user = new User({
           username,
           email,
           password,
        });
        await user.save();
        const userCreated = await User.findById(user._id).select("-password");
  
        if (!userCreated) {
          throw new Error("User creation failed");
        }
        return res.status(200).json({ message: "User created successfully", user: userCreated });
      }
      catch (error) {
        return res.status(500).json({ message: "Some thing is Wrong while creating the user" });
      }
   
}*/
export { getAllusers, signUp, login, verifyUser, logout };
//# sourceMappingURL=user-controller.js.map
