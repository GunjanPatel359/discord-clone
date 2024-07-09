import mongoose from "mongoose";

export async function connectDB(){
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection=mongoose.connection;
        connection.on('connected',()=>{
            console.log('MongoDB connected')
        })
        connection.on('error',(err)=>{
            console.log('MongoDB connection error');
            console.log(err)
            process.exit()
        })
    } catch (err) {
        console.log('somthing went wrong in connecting db');
        console.log(err)
    }
}