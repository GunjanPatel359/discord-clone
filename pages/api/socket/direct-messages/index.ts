import Channel from "@/app/models/ChannelModel";
import Conversation from "@/app/models/Conversation";
import DirectMessage from "@/app/models/DirectMessage";
import Member from "@/app/models/MemberModel";
import { Message } from "@/app/models/MessageModel";
import Server from "@/app/models/ServerModel";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowded" });
    }

    try {
        const profile = await currentProfilePages(req);
        const { content, fileUrl } = req.body;
        const { conversationId } = req.query;
        if (!profile) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!conversationId) {
            return res.status(400).json({ error: "conversation ID missing" });
        }
        if (!content) {
            return res.status(400).json({ error: "Content ID missing" });
        }

        const conversation=await Conversation.findOne({
           _id:conversationId
        }).populate("memberOne memberOne.profile memberTwo memberTwo.profile")
        if(!conversation){
            return res.status(404).json({message:"Conversation not found"})
        }
        
        const verify=(conversation.memberOne.profile).toString()==(profile._id).toString() || (conversation.memberTwo.profile).toString()==(profile._id).toString()
        if(!verify){
            return res.status(401).json({message:"Access unauthorized"})
        }

        const member=(conversation.memberOne.profile).toString() == (profile._id).toString() ?  conversation.memberOne:conversation.memberTwo
        if(!member){
            return res.status(404).json({message:"Member not found"})
        }
        const newmessage= await DirectMessage.create({
            content,
            fileUrl,
            conversationId:conversationId,
            conversation:conversationId,
            member:member._id,
            memberId:member._id,
            createAt:Date.now()
        })

        const message=await newmessage.populate({path: 'member',populate: {path: 'profile'}})
        
        const channelKey=`chat:${conversationId}:messages`;
        
        res?.socket?.server?.io?.emit(channelKey,message)
        
        return res.status(200).json(message)

    } catch (error) {
        console.log("[DIRECT_MESSAGES_POST]", error)
        return res.status(500).json({ message: "Internal Error" });
    }
}