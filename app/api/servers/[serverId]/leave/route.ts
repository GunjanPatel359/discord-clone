import Member from "@/app/models/MemberModel";
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
            return new NextResponse("Unauthorized",{status:401});
        }
        if(!params.serverId){
            return new NextResponse("Server ID missing",{status:400});
        }
        console.log(params.serverId)
        const server=await Server.findById({
            _id:params.serverId,
        })
        if(server.profileId==profile._id){
            return new NextResponse("Admin cannot leave the server",{status:401});
        }
        const member=await Member.findOneAndDelete({
            serverId:params.serverId,
            profile:profile._id,
        })
        if(!member){
            return new NextResponse("You are not part of this server",{status:404});
        }
        const newserver=await Server.findOneAndUpdate({
            _id:server._id
        },{
            $pull:{members:member._id}
        },{new:true});
        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVER_ID LEAVE]",error);
        return new NextResponse("Internal Error",{status:500})
    }
}