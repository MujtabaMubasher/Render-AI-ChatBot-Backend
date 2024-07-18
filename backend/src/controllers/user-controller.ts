import  {User}  from "../models/user-model.js";
import { generateAccessToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

const getAllusers = async (req, res, next) => {
  try {
    const users = await User.find()
    return res.status(200).json({message:"ok", users: users})
  } catch (error) {
    console.log(error);
    return res
    .status(401)
    .json({message:"Error", cause: error.message})
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
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Something went wrong while creating the user", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    //console.log("Login request received:", req.body);
    const  {email, password} = req.body;
     const userExist = await User.findOne({email});
    if (!userExist) {
       return res.status(401).send("This email doest not Exist");   
    }
    //console.log(user);
  
    const isPasswordValid = await userExist.isPasswordCorrect(password);
    
    if (!isPasswordValid) {
       return res.status(401).send("Password is Invalid")
    }

    const accessToken =  await generateAccessToken(userExist._id, userExist.email, process.env.ACCESS_TOKEN_EXPIRY)

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.clearCookie(".Tunnels.Relay.WebForwarding.Cookies", {
      httpOnly: false,
      domain: "localhost",
      signed: true,
      path: "/",
      secure: true
    });

    res.cookie(
      COOKIE_NAME,
      accessToken,
      {
        path: "/",
        domain: "localhost",
        expires,
        httpOnly: true,
        signed: true,
        secure: true,
      }
    )

    const userLogin = await User.findById(userExist._id).select("-password");

    return res.status(200).json({
      name: userLogin.username,
      email: userLogin.email,
      message:"Login Successful"
    });
  } catch (error) {
    console.error("Error Login user:", error);
    return res.status(500).json({ message: "Something went wrong while Login the user", error: error.message });
  }
}



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
  } catch (error) {
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

    res.clearCookie(
      COOKIE_NAME,
    {
      httpOnly: false,
      domain: "localhost",
      signed: true,
      path: "/",
      secure: true
    });

    return res.status(200).json({
      message:"Logout Successful"
    });
  } catch (error) {
    console.error("Error Login user:", error);
    return res.status(500).json({ message: "Something went wrong while logout the user", error: error.message });
  }
}


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

export  {getAllusers,signUp,login,verifyUser,logout}