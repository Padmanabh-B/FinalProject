import mongoose from "mongoose";
import app from "./app";
import config from "./config/index"

// create a fn 
// run a fn

//(async ()=>{
//
//})()

(async ()=>{
    try {
        await mongoose.connect(config.MONGODB_URL)
        console.log("DB Connected");

        app.on('error', (err)=>{
            console.log("ERROR ",err);
            throw err;
        })

        const onListening = ()=>{
            console.log(`Server is running on ${config.PORT}`);
        }

        app.listen(config.PORT,onListening)


    } catch (err) {
        console.log("ERROR ", err);
        throw err; // kill the execusion
        
    }
})()