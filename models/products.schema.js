import mongoose from "mongoose";


const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Provide a Product Name"],
        trim: true,
        maxLength: [120, "Product name should be a max of 120 charachters"]

    },
    price: {
        type: Number,
        required: [true, "Please Provide a Product Price"],
        maxLength: [5, "Product price should be not be more than 5 digits"]
    },
    description: {
        type: String,
        //use some form of editor - personal assinment
    },
    photos: [
        {
            secure_url: {
                type: String,
                require: true,
            }
        }
    ],
    stock: {
        type: Number,
        default: 0,
    },
    sold: {
        type: Number,
        default: 0,
    },
    collectionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Collection",
    },
    

},
    {
        timestamps: true,
    })



export default mongoose.model("Product", productSchema);