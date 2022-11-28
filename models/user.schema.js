import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles";
import jwt from "jsonwebtoken";


const userSchema = mongoose.Schema(
    {
        name: {
            type:String,
            required:[true, "Name is required"],
            maxlength:[50, "Name must be under 50"],
            trim:true,
        },
        email:{
            type:String,
            required:[true, "Email is required"],
            unique:true,
        },
        password:{
            type:String,
            required:[true, "password is required"],
            minlength:[8, "password must be at least 8 characters"],
            select:false,
        },
        role:{
            type:String,
            enum:Object.values(AuthRoles),
            default:AuthRoles.USER,
        },
        forgotPasswordToken:String,
        forgotPasswordExpiry:Date,


    },
    {
        timestamps: true
    }
);

export default mongoose.model("User", userSchema);
