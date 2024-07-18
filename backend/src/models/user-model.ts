import mongoose,{Document, Schema} from "mongoose";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt"

const chatSchema = new Schema({
    id:{
        type: String,
        default: randomUUID(),
    },
    role : {
        type: String,
        required: true,
    },
    content:{
        type: String,
        required: true,
    }
},
{timestamps: true});
const userSchema = new Schema(
  {
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    chats: [chatSchema],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next){
    if (!this.isModified("password") ) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
});

interface IUser extends Document {
     username: string;
     email: string;
     password: string;
     chats: Array<any>; // Change this type according to your chat schema
    isPasswordCorrect(password) //Promise<boolean>; // Custom method
}

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};                         

export const User = mongoose.model<IUser>("User", userSchema);