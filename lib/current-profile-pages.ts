import { getAuth } from "@clerk/nextjs/server";

import { connectDB } from "@/dbConfig/dbConfig";
import Profile from "@/app/models/ProfileModel";
import { NextApiRequest } from "next";

connectDB()

export const currentProfilePages=async(req:NextApiRequest)=>{
    const {userId}=getAuth(req);
    
    if(!userId){
        return null;
    }

    const profile = await Profile.findOne({profileId:userId})

    return profile
}