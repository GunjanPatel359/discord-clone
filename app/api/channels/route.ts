import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import Member, { MemberType } from "@/app/models/MemberModel";
import Channel from "@/app/models/ChannelModel";
import Server from "@/app/models/ServerModel";

export async function POST(
    req:Request
){
    try {
        const profile=await currentProfile() as any
        const {name,type}=await req.json();
        const {searchParams}=new URL(req.url);
        const serverId=searchParams.get("serverId");

        if(!profile){
            return NextResponse.json("Unauthorized",{status:401})
        }
        if(!serverId){
            return new NextResponse("Server ID missing",{status:400});
        }
        if(name==='general'){
            return new NextResponse("Name cannot be general",{status:400});
        }
        const member=await Member.findOne({
            profile:profile._id,
            server:serverId
        }) as any
        if(!member){
            return new NextResponse("Member not found",{status:404});
        }
        console.log(member)
        if(member?.role==="ADMIN"||member?.role==="MODERATOR"){
            const channel=await Channel.create({
                name:name,
                channeltype:type,
                serverId:serverId,
                server:serverId,
            })
            const server=await Server.findOneAndUpdate({
                _id:serverId
            },{
                $push:{channel:channel._id}
            },{new:true})
            return NextResponse.json(server);
        }
        return new NextResponse("Error",{status:401});
    } catch (error) {
        console.log("CHANNELS_POST",error);
        return new NextResponse("Internal Error",{status:500});
    }
}