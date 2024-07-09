import Channel from "@/app/models/ChannelModel";
import Member from "@/app/models/MemberModel";
import Server from "@/app/models/ServerModel";
import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface ServerIdPageProps{
    params:{
        serverId:string;
    }
};

const ServerIdPage=async({
    params
}:ServerIdPageProps)=>{
    const profile=await currentProfile()
    if(!profile){
        return auth().redirectToSignIn()
    }
    const member=await Member.findOne({
        profile:profile._id,
        server:params.serverId
    })
    if(!member){
        return auth().redirectToSignIn()
    }
    const channel=await Channel.findOne({
        server:params.serverId,
        name:"general",
        profile:profile._id
    })

    const initialChannel=channel;
    if(initialChannel?.name !== "general"){
        return null
    }
    return redirect(`/servers/${params.serverId}/channels/${initialChannel._id}`)
}

export default ServerIdPage