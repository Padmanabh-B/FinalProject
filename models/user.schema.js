import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema(
    {
        name: {
            type:String,
            required:[true, "Name is required"],
            maxlength:[50, "Name must be under 50"],
            trim:true,
        }
    }
)
