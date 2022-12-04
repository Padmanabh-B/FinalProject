import mongoose from "mongoose";


const orderSchema = mongoose.Schema({
    product:{
        type:[
            {
                productId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Product",
                    required:true,
                },
                count:Number,
                price:Number,
            }
        ],
        required:true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    phoneNumber:{
        type:Number,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    coupan:{
        type:String,
    },    
    transactionId:{
        type:String
    },
    status:{
        type:String,
        enum:["ORDERED","SHIPPED","DELIVERED","CANCLED"],
        default:"ORDERED",
        //can we improve this ?
    },
    //payment mode : UPI, creadCard or Wallet, COD
},
{
    timestamps: true,
})


export default mongoose.model("Order", orderSchema);
