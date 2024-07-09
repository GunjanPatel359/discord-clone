import {v4 as uuidv4} from "uuid"
import Server from "@/app/models/ServerModel";
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";

export async function PATCH(
    req:Request,
    {params}:{params:{serverId:string}}
){
    try {
        const profile=await currentProfile();
        if(!profile){
            return new NextResponse("Unauthorized",{status:401})
        }
        if(!params.serverId){
            return new NextResponse("Server ID Missing",{status:400})
        }
        const server=await Server.findOneAndUpdate({
            _id:params.serverId,
            profileId:profile._id
        },{
            inviteCode:`${uuidv4()}`
        },{new:true});

        return NextResponse.json(server)
    } catch (error) {
        console.log("[SERVER_ID]",error);
        return new NextResponse("Internal Error",{status:500})
    }
}