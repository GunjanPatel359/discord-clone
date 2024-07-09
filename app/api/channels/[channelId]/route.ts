import Channel from "@/app/models/ChannelModel";
import Member from "@/app/models/MemberModel";
import Server from "@/app/models/ServerModel";
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";

export async function DELETE(
    req:Request,
    {params}:{params:{channelId:string}}
){
    try {
        const profile=await currentProfile();
        const {searchParams}=new URL(req.url);
        const serverId=searchParams.get("serverId")
        if(!profile){
            return new NextResponse("Unauthorized",{status:401});
        }
        if(!serverId){
            return new NextResponse("Server ID missing",{status:400});
        }
        if(!params.channelId){
            return new NextResponse("Channel ID missing",{status:400})
        }
        const member=await Member.findOne({
            profile:profile._id,
            server:serverId
        }) 
        const channels=await Channel.findOne({
            _id:params.channelId,
            server:serverId
        })

        if(!channels || !member){
            return new NextResponse("channel not found",{status:404})
        }
        if(channels.name=="general"){
            return new NextResponse("Cannot delete general channel",{status:400})
        }
        if(member.role=="ADMIN"||member.role=="MODERATOR"){
            const server=await Server.findOneAndUpdate({
                _id:serverId,
                members:member._id,
                channel:params.channelId
            },{
                $pull:{channel:params.channelId}
            },{new:true})
            if(!server){
                return new NextResponse("intenal error",{status:402})
            }
            const channel=await Channel.findByIdAndDelete({
                _id:params.channelId,
            })
            return NextResponse.json(server)
        }
        return new NextResponse("only owner's and admin can delete this channel",{status:402})
    } catch (error) {
        console.log("[CHANNEL_ID_DELETE]",error);
        return new NextResponse("Internal Error",{status:500})
    }
}
export async function PATCH(
    req:Request,
    {params}:{params:{channelId:string}}
){
    try {
        const profile=await currentProfile();
        const {name,type}=await req.json()
        const {searchParams}=new URL(req.url);
        const serverId=searchParams.get("serverId")
        if(!profile){
            return new NextResponse("Unauthorized",{status:401});
        }
        if(!serverId){
            return new NextResponse("Server ID missing",{status:400});
        }
        if(!params.channelId){
            return new NextResponse("Channel ID missing",{status:400})
        }
        const member=await Member.findOne({
            profile:profile._id,
            server:serverId
        }) 
        const channels=await Channel.findOne({
            _id:params.channelId,
            server:serverId
        })

        if(!channels || !member){
            return new NextResponse("channel not found",{status:404})
        }
        if(channels.name=="general"){
            return new NextResponse("Cannot update general channel",{status:400})
        }
        if(member.role=="ADMIN"||member.role=="MODERATOR"){
            const server=await Server.findOne({
                _id:serverId,
                members:member._id,
                channel:params.channelId
            })
            if(!server){
                return new NextResponse("intenal error",{status:402})
            }
            const channel=await Channel.findByIdAndUpdate({
                _id:params.channelId,
            },{
                name:name,
                channeltype:type
            },{new:true})
            return NextResponse.json(server)
        }
        return new NextResponse("only owner's and admin can delete this channel",{status:402})
    } catch (error) {
        console.log("[CHANNEL_ID_PATCH]",error);
        return new NextResponse("Internal Error",{status:500})
    }
}