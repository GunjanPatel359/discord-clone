import Channel from "@/app/models/ChannelModel";
import Member from "@/app/models/MemberModel";
import Server from "@/app/models/ServerModel";
import { currentProfile } from "@/lib/current-profile"
import { NextResponse } from "next/server"

export async function DELETE(
    req:Request,
    {params}:{params:{serverId:string}}
){
    try {
        const profile=await currentProfile();
        if(!profile){
            return NextResponse.json("Unauthorized",{status:401})
        }
        const server=await Server.findOneAndDelete({
            _id:params.serverId,
            profileId:profile._id
        })
        if(!server){
            return NextResponse.json("Server not found",{status:404})
        }
        const members=await Member.deleteMany({
            serverId:server._id
        })
        const channels=await Channel.deleteMany({
            server:server._id
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log("[SERVER_ID_DELETE]",error)
        return new NextResponse("Internal Error",{status:500})
    }
}
export async function PATCH(
    req:Request,
    {params}:{params:{serverId:string}}
){
    try {
        const profile=await currentProfile();
        const {name,imageUrl}=await req.json()
        if(!profile){
            return NextResponse.json("Unauthorized",{status:401})
        }

        const server=await Server.updateOne({
            _id:params.serverId,
            profileId:profile._id
        },{
            name,
            imageUrl
        },{new:true})

        return NextResponse.json(server)
    } catch (error) {
        console.log("[SERVER_ID_PATCH]",error)
        return new NextResponse("Internal Error",{status:500})
    }
}