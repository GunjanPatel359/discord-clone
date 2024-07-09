import mongoose, { Schema } from "mongoose";
import Member from "./MemberModel";
import Channel from "./ChannelModel";

export interface MessageType{
    _id: any;
    content:string
    fileUrl?:string
    memberId:mongoose.Schema.Types.ObjectId
    member:mongoose.Schema.Types.ObjectId
    channelId:mongoose.Schema.Types.ObjectId
    channel:mongoose.Schema.Types.ObjectId
    deleted:boolean
    createdAt: Date;
    updatedAt?: Date;
}

const messageSchema = new Schema<MessageType>({
  content: { type: String, required: true },
  fileUrl: String,
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: "Member" }, 
  member: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },  
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" }, 
  channel: { type:mongoose.Schema.Types.ObjectId, ref: "Channel" },  
  deleted: {type:Boolean,default:false},
  createdAt: { type: Date, 
    default:Date.now
  },
  updatedAt: {type:Date},
});

export const Message =mongoose.models.Message || mongoose.model<MessageType>("Message", messageSchema);
