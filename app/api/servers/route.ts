import {v4 as uuidv4} from "uuid";
import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";

import { connectDB } from "@/dbConfig/dbConfig";
import Server from "@/app/models/ServerModel";
import Channel from "@/app/models/ChannelModel";
import Member from "@/app/models/MemberModel";

//later we will be adding transaction for our db's atomicity
connectDB()

export async function POST(req:Request){
    try {
        const {name,imageUrl}=await req.json()
        const profile=await currentProfile()
        if(!profile){
            return new NextResponse("Unauthorized",{status:401});
        }

        const channel=await Channel.create({
            profileId:profile.profileId,
            profile:profile._id,
            name:"general"
        })
        const server=await Server.create({
            name,
            imageUrl,
            profileId:profile._id,
            inviteCode:uuidv4(),
            channel:[channel._id]
        })
        const members= await Member.create({
            profileId:profile.profileId,
            profile:profile._id,
            serverId:server._id,
            server:server._id,
            role:'ADMIN'
        })

        await server.save().then(() => {
            server.members.push(members._id);
            channel.serverId=server._id
            channel.server=server._id
            profile.servers.push(server._id);
            return Promise.all([server.save(),profile.save(),channel.save()]);
        });

        await profile.save()
        await server.save()
        await channel.save()

        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_POST]",error);
        return new NextResponse("Internal Error",{status:500});
    }
}