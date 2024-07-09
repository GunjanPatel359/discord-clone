import mongoose, { Schema } from 'mongoose';

export interface ConversationType {
  memberOneId: string;
  memberOne: mongoose.Schema.Types.ObjectId;
  memberTwoId: string;
  memberTwo: mongoose.Schema.Types.ObjectId;
  directMessage?:string[]
}

const ConversationSchema = new Schema<ConversationType>({
  memberOneId: { type: String, required: true },
  memberOne: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Member" }, 
  memberTwoId: { type: String, required: true },
  memberTwo: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Member" }, 
  directMessage: { type:[String]}
});

const Conversation=mongoose.models.Conversation || mongoose.model<ConversationType>('Conversation',ConversationSchema)

export default Conversation;
