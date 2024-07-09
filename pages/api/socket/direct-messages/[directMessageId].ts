import Channel from "@/app/models/ChannelModel";
import Member from "@/app/models/MemberModel";
import { Message } from "@/app/models/MessageModel";
import Server from "@/app/models/ServerModel";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import { connectDB } from "@/dbConfig/dbConfig";
import Conversation from "@/app/models/Conversation";
import DirectMessage from "@/app/models/DirectMessage";

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
        const {directMessagesId,conversationId}=req.query;
        const {content}=req.body;

        if(!profile){
            return res.status(401).json({error:"Unauthorized"});
        }
        if(!conversationId){
            return res.status(400).json({error:"conversation Id missing"});
        }
        const conversation=await Conversation.findOne({
            _id:conversationId,
        }).populate("memberOne memberTwo memberOne.profile memberTwo.profile")
        if(!conversation){
            return res.status(400).json({error:"conversation not found"});
        }
        const verify=(conversation.memberOne.profile).toString()==(profile._id).toString() || (conversation.memberTwo.profile).toString()==(profile._id).toString()
        if(!verify){
            return res.status(401).json({error:"Unauthorized"});
        }

        const member=(conversation.memberOne.profile).toString() == (profile._id).toString() ?  conversation.memberOne:conversation.memberTwo

        let directMessages=await DirectMessage.findOne({
            _id:directMessagesId,
            conversationId: conversationId
        }).populate({path: 'member',populate: {path: 'profile'}})

        if(!directMessages || directMessages.deleted){
            return res.status(404).json({error:"Message not found"})
        }

        const isMessageOwner = (directMessages.memberId).toString() === (member._id).toString();
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator=member.role === MemberRole.MODERATOR;

        const canModify=isMessageOwner || isAdmin || isModerator;  

        if(!canModify){
            return res.status(401).json({error:"Unauthorized"})
        }

        if(req.method === "DELETE"){
            directMessages = await DirectMessage.updateOne({
                _id:directMessagesId
            },{
                fileUrl:null,
                content:"This message has been deleted",
                deleted:true,
                // updatedAt:true
            },{new:true}).populate({path: 'member',populate: {path: 'profile'}})
        }
        if(req.method === "PATCH"){
            if(!isMessageOwner){
                return res.status(401).json({error:"Unauthorized"})
            }
            directMessages = await DirectMessage.updateOne({
                _id:directMessagesId
            },{
                content,
                updatedAt:Date.now()
            },{new:true})
            // .populate({path: 'member',populate: {path: 'profile'}})
            // console.log(message)
        }
        directMessages = await Message.findOne({
            _id:directMessagesId
        }).populate({path: 'member',populate: {path: 'profile'}})
        // console.log(message)

        const updateKey=`chat:${conversation._id}:messages:update`;

        res?.socket?.server?.io?.emit(updateKey,directMessages);

        return res.status(200).json(directMessages)
        
    } catch (error) {
        console.log("[MESSAGE_ID]",error)
        return res.status(500).json({error:"Internal error"})
    }
}