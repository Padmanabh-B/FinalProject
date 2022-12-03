import mongoose from "mongoose";

const collectionSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, "Please Provide a Category name"],
            trim:true,
            maxLength:[120, 'Collection name should not be more than']

        },
    },{
        timestamps :true,
    }
);

export default mongoose.model("Collection", collectionSchema);