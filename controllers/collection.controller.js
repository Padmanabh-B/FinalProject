import Collection from "../models/collection.schema"
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"


/*********************************
* @Create_Collection 
* @route http://localhost:4000/api/collection
* @description Collection controller for creating a new Collection
* @parameters name
* @return Collection Object
*********************************/
export const createCollection = asyncHandler(async (req, res) => {
    //take name from frontend
    const { name } = req.body;


    if (!name) {
        throw new CustomError("Collection name is required", 400)
    }

    //add this name to database
    const collection = await Collection.create({
        name
    })

    //send this response value to front-end
    res.status(200).json({
        success: true,
        message: "Collection Created Successfully",
        collection
    })
})

export const updateCollection = asyncHandler(async (req, res) => {
    //exisiting value to be updated
    const { id: collectionId } = req.params;



    //new value to get updated

    const { name } = req.body;

    if (!name) {
        throw new CustomError("Collection name is required", 400)
    }

    let updatedCollection = await Collection.findByIdAndUpdate(
        collectionId,
        {
            name,
        },
        {
            new:true, //give updated values
            runValidators:true,

        },

    )

    if(!updateCollection){
        throw new CustomError("Collection Not Found", 400)
    }

    //send response to front-end
    res.status(200).json({
        success:true,
        message:"Collection Updated Sucessfully", 
        updateCollection,

    })
})

export const deleteCollection = asyncHandler(async (req, res) => {
    const {id:collectionId} = req.params;

    const deletedCollection = await Collection.findByIdAndDelete(collectionId)

    if(!deletedCollection){
        throw new CustomError("Collection Not Found", 400)
    }

    deletedCollection.remove()

    res.status(200).json({
        success:true,
        message:"Collection Deleted Sucessfully",
    })

})

export const getAllCollection = asyncHandler(async (req, res) => {
    const collections = await Collection.find();

    if(!collections){
        throw new CustomError("Collection Not Found", 400)

    }

    res.status(200).json({
        success:true,
        collections,
    })
})