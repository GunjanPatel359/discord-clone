import Channel from "@/app/models/ChannelModel";
import { Message } from "@/app/models/MessageModel";
import Server from "@/app/models/ServerModel";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
) {
    if (req.method != "POST") {
        return res.status(405).json({ error: "Method not allowded" });
    }

    try {
        const profile = await currentProfilePages(req);
        const { content, fileUrl } = req.body;
        const { serverId, channelId } = req.query;
        if (!profile) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!serverId) {
            return res.status(400).json({ error: "Server ID missing" });
        }
        if (!channelId) {
            return res.status(400).json({ error: "Channel ID missing" });
        }
        if (!content) {
            return res.status(400).json({ error: "Content ID missing" });
        }
        const server = await Server.findOne({ _id: serverId }).populate('members members.profile')
        if (!server) {
            return res.status(404).json({message:"Server not found"})
        } 
        const channel=await Channel.findOne({
            _id:channelId,
            serverId:serverId
        })

        if(!channel){
            return res.status(404).json({message:"Channel not found"})
        }
        const member=server.members.find((member:any)=>(member.profile).toString() == (profile._id).toString());
        if(!member){
            return res.status(404).json({message:"Member not found"})
        }

        const newmessage= await Message.create({
            content,
            fileUrl,
            channelId:channelId,
            channel:channelId,
            member:member._id,
            memberId:member._id,
            // createAt:Date.now()
        })

        const message=await newmessage.populate({path: 'member',populate: {path: 'profile'}})
        
        const channelKey=`chat:${channelId}:messages`;
        
        res?.socket?.server?.io?.emit(channelKey,message)
        
        return res.status(200).json(message)

    } catch (error) {
        console.log("[MESSAGES_POST]", error)
        return res.status(500).json({ message: "Internal Error" });
    }
}