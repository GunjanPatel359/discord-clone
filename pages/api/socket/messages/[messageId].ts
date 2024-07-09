import Channel from "@/app/models/ChannelModel";
import Member from "@/app/models/MemberModel";
import { Message } from "@/app/models/MessageModel";
import Server from "@/app/models/ServerModel";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import { connectDB } from "@/dbConfig/dbConfig";

connectDB()

enum MemberRole{
    ADMIN="ADMIN",
    MODERATOR="MODERATOR",
    GUEST="GUEST"
}

export default async function handler(
    req:NextApiRequest,
    res:NextApiResponseServerIo
) {
    if(req.method !== "DELETE" && req.method !== "PATCH"){
        return res.status(405).json({error:"Method not allowed"})
    }
    try {
        const profile =await currentProfilePages(req);
        const {messageId,serverId,channelId}=req.query;
        const {content}=req.body;

        if(!profile){
            return res.status(401).json({error:"Unauthorized"});
        }
        if(!serverId){
            return res.status(400).json({error:"ServerId missing"});
        }
        if(!channelId){
            return res.status(400).json({error:"ChannelId missing"});
        }
        const member=await Member.findOne({
            profile:profile._id,
            server:serverId
        })
        if(!member){
            return res.status(400).json({error:"Member not found"});
        }
        const server=await Server.findOne({
            _id:serverId,
            members:member._id
        }).populate({path: 'members',populate: {path: 'profile'}})

        if(!server){
            return res.status(404).json({error:"Server not found"})
        }

        const channel=await Channel.findOne({
            _id:channelId,
            server:server._id
        });

        if(!channel){
            return res.status(404).json({error:"Channel not found"})
        }
        const findmember=server.members.find((member:any)=>(member.profile._id).toString() == (profile._id).toString())

        if(!findmember){
            return res.status(404).json({error:"Member not found"})
        }
        
        let message=await Message.findOne({
            _id:messageId,
            channelId:channelId
        }).populate({path: 'member',populate: {path: 'profile'}})

        if(!message || message.deleted){
            return res.status(404).json({error:"Message not found"})
        }

        const isMessageOwner = (message.memberId).toString() === (member._id).toString();
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator=member.role === MemberRole.MODERATOR;

        const canModify=isMessageOwner || isAdmin || isModerator;  

        if(!canModify){
            return res.status(401).json({error:"Unauthorized"})
        }

        if(req.method === "DELETE"){
            message = await Message.updateOne({
                _id:messageId
            },{
                fileUrl:null,
                content:"This message has been deleted",
                deleted:true,
                // updatedAt:true
            },{new:true}).populate({path: 'member',populate: {path: 'profile'}})
            console.log(message)
        }
        if(req.method === "PATCH"){
            if(!isMessageOwner){
                return res.status(401).json({error:"Unauthorized"})
            }
            message = await Message.updateOne({
                _id:messageId
            },{
                content,
                updatedAt:Date.now()
            },{new:true})
            // .populate({path: 'member',populate: {path: 'profile'}})
            // console.log(message)
        }
        message = await Message.findOne({
            _id:messageId
        }).populate({path: 'member',populate: {path: 'profile'}})
        // console.log(message)

        const updateKey=`chat:${channelId}:messages:update`;

        res?.socket?.server?.io?.emit(updateKey,message);

        return res.status(200).json(message)
        
    } catch (error) {
        console.log("[MESSAGE_ID]",error)
        return res.status(500).json({error:"Internal error"})
    }
}