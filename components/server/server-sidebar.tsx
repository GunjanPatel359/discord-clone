import { currentProfile } from "@/lib/current-profile"
import { redirect } from "next/navigation";

import Server from "@/app/models/ServerModel";
import Member from "@/app/models/MemberModel";
import Channel from "@/app/models/ChannelModel";

import { ServerHeader } from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import { ServerSearch } from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

interface ServerSidebarProps{
    serverId:string
}

enum channelType{
    TEXT="TEXT",
    AUDIO="AUDIO",
    VIDEO="VIDEO"
}

const iconMap:any = {
    [channelType.TEXT]:<Hash className="mr-2 h-4 w-4 inline" />,
    [channelType.AUDIO]:<Mic className="mr-2 h-4 w-4 inline" />,
    [channelType.VIDEO]:<Video className="mr-2 h-4 w-4 inline" />,
}

enum roleType{
    GUEST="GUEST",
    MODERATOR="MODERATOR",
    ADMIN="ADMIN"
}

const roleIconMap:any={
    [roleType.GUEST]:null,
    [roleType.MODERATOR]:<ShieldCheck className="h-4 w-4 mr-2 text-indigo-500 inline" />,
    [roleType.ADMIN]:<ShieldAlert className="h-4 w-4 mr-2 text-rose-500 inline" />
}

export const ServerSidebar=async({
    serverId
}:ServerSidebarProps)=>{

    const profile=await currentProfile();
    if(!profile){
        return redirect("/")
    }
    
    let server=await Server.findById({_id:serverId})
    if(!server){
        return redirect("/")
    }

    const member=server.members.map(async(memberId:any)=>await Member.findById({_id:memberId}).populate("profile"))
    let memberList=await Promise.all(member)
    const channels=server.channel.map(async(channelId:any)=>await Channel.findById({_id:channelId}))
    let channelList=await Promise.all(channels)
    
    let textChannels=channelList?.filter((channel)=>channel.channeltype==="TEXT")
    let audioChannels=channelList?.filter((channel)=>channel.channeltype==="AUDIO")
    let videoChannels=channelList?.filter((channel)=>channel.channeltype==="VIDEO")

    const members=memberList.filter((member)=>member.profileId!==profile._id)
    const roles= memberList.filter(member => (member.profile._id).toString()===profile._id.toString())
    const role=roles[0].role

    // console.log(server)
    // console.log(memberList)
    // console.log(channelList)
    // console.log(textChannels)
    // console.log(audioChannels)
    // console.log(videoChannels)
    // console.log(members)
    // console.log(memberList)
    // console.log(profile)
    // console.log(role)

    
    // server.members = memberList;
    // server.channel = channelList;
    // console.log(server)

    server=JSON.parse(JSON.stringify(server))
    memberList=JSON.parse(JSON.stringify(memberList))
    channelList=JSON.parse(JSON.stringify(channelList))

    server.members=memberList
    server.channel=channelList
    textChannels=JSON.parse(JSON.stringify(textChannels))
    audioChannels=JSON.parse(JSON.stringify(audioChannels))
    videoChannels=JSON.parse(JSON.stringify(videoChannels))
    memberList=JSON.parse(JSON.stringify(memberList))
    
    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5">
            <ServerHeader
            server={server}
            role={role}
            />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch 
                    data={[
                        {
                        label:"Text Channels",
                        type:"channel",
                        data:textChannels?.map((channel)=>({
                            id:channel._id,
                            name:channel.name,
                            icon: iconMap[channel.channeltype],
                        }))
                    },
                    {
                        label:"Voice Channels",
                        type:"channel",
                        data:audioChannels?.map((channel)=>({
                            id:channel._id,
                            name:channel.name,
                            icon: iconMap[channel.channeltype],
                        }))
                    },
                    {
                        label:"Video Channels",
                        type:"channel",
                        data:videoChannels?.map((channel)=>({
                            id:channel._id,
                            name:channel.name,
                            icon: iconMap[channel.channeltype],
                        }))
                    },
                    {
                        label:"Members",
                        type:"member",
                        data:memberList?.map((member)=>({
                            id:member._id,
                            name:member.profile.name,
                            icon: roleIconMap[member.role],
                        }))
                    }
                    ]} 
                    />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
                {!!textChannels?.length && (
                    <div className="mb-2">
                        <ServerSection 
                        sectionType="channels"
                        channelType={channelType.TEXT}
                        role={role}
                        label="Text Channels"
                        />
                        <div className="space-y-[2px]">
                        {textChannels.map((channel:any):any=>
                            <ServerChannel
                            key={channel._id}
                            channel={channel}
                            role={role}
                            server={server}
                            />
                        )}
                        </div>
                    </div>
                )}
                {!!audioChannels?.length && (
                    <div className="mb-2">
                        <ServerSection 
                        sectionType="channels"
                        channelType={channelType.AUDIO}
                        role={role}
                        label="Voice Channels"
                        />
                        <div className="space-y-[2px]">
                        {audioChannels.map((channel:any):any=>
                            <ServerChannel
                            key={channel._id}
                            channel={channel}
                            role={role}
                            server={server}
                            />
                        )}
                        </div>
                    </div>
                )}
                {!!videoChannels?.length && (
                    <div className="mb-2">
                        <ServerSection 
                        sectionType="channels"
                        channelType={channelType.VIDEO}
                        role={role}
                        label="Video Channels"
                        />
                        <div className="space-y-[2px]">
                        {videoChannels.map((channel:any):any=> 
                            <ServerChannel
                            key={channel._id}
                            channel={channel}
                            role={role}
                            server={server}
                            />
                        )}
                        </div>
                    </div>
                )}
                {!!memberList?.length && (
                    <div className="mb-2">
                        <ServerSection 
                        sectionType="members"
                        role={role}
                        label="Members"
                        server={server}
                        />
                        <div className="space-y-[2px]">
                        {memberList.map((member:any):any=>
                            <ServerMember
                            key={member._id}
                            member={member}
                            server={server}
                            />
                        )}
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}