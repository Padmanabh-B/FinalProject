import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles";
import JWT from "jsonwebtoken"
import bcrypt from "bcryptjs/dist/bcrypt";
import crypto from "crypto"

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

//Challenge Part - 1 Encrypt Password - Hooks
userSchema.pre("save", async function(next){
    if(!this.modified("password")) return next();
    this.password = await bcrypt.has(this.password, 10)
    next()
})

export default mongoose.model("User", userSchema);
