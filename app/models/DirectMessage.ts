import mongoose, { Schema } from 'mongoose';

export interface DirectMessageType {
  content: string;
  fileUrl?: string;
  memberId: string;
  member: mongoose.Schema.Types.ObjectId;
  conversationId: string;
  conversation: mongoose.Schema.Types.ObjectId;
  deleted?:boolean
  createdAt: Date;
}

const directMessageSchema = new Schema({
  content: { type: String, required: true },
  fileUrl: String,
  memberId: { type: String, required: true },
  member: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Member" },
  conversationId: { type: String, required: true },
  conversation: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Conversation" },
  deleted:{type:Boolean,default:false},
  createdAt: { type: Date, default: Date.now },
});
const DirectMessage=mongoose.models.DirectMessage || mongoose.model<DirectMessageType>('DirectMessage',directMessageSchema)
export default DirectMessage;
