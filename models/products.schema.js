import mongoose  from "mongoose";


const productSchema = mongoose.Schema({
    name:{
        type:String,
        
    }
})



export default mongoose.model("Product", productSchema);