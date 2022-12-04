import mongoose  from "mongoose";


const coupanSchema = mongoose.Schema({
    code:{
        type:String,
        required:[true, 'Please provid a coupan name']
        
    },
    discout:{
        type:Number,
        default:0,
    },
    active:{
        type:Boolean,
        default:true,
    }
},
{
    timestamps:true,
}
)



export default mongoose.model("Coupan", coupanSchema);