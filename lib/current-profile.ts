import { auth } from "@clerk/nextjs/server";

import { connectDB } from "@/dbConfig/dbConfig";
import Profile from "@/app/models/ProfileModel";

connectDB()

export const currentProfile=async()=>{
    const {userId}=auth();
    // console.log(userId)
    if(!userId){
        return null;
    }

    const profile = await Profile.findOne({profileId:userId})

    return profile
}