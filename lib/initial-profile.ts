import { currentUser,auth } from "@clerk/nextjs/server";

import { connectDB } from "@/dbConfig/dbConfig";
import Profile from '@/app/models/ProfileModel'

connectDB()

export const initialProfile=async()=>{
    const user=await currentUser();
    if(!user){
        return auth().redirectToSignIn();
    }
    const profile=await Profile.findOne({profileId:user.id});

    if(profile){
        return profile;
    }

    const newProfile = await Profile.create({
        profileId:user.id,
        name:`${user.firstName} ${user.lastName}`,
        imageUrl:user.imageUrl,
        email:user.emailAddresses[0].emailAddress
    })

    return newProfile;
}