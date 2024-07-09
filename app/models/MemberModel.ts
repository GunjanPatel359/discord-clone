import mongoose, { Schema, InferSchemaType } from 'mongoose';
import  Profile  from './ProfileModel';
import  Server  from './ServerModel';
import Conversation from './Conversation';

export interface MemberType {
  _id: mongoose.Schema.Types.ObjectId;
  role: string;
  profileId?: string; 
  profile: mongoose.Schema.Types.ObjectId;
  serverId?: string; 
  server: mongoose.Schema.Types.ObjectId;
  messages?:mongoose.Schema.Types.ObjectId;
  directMessages?:string[];
  conversationsInitiated?:mongoose.Schema.Types.ObjectId[];
  conversationsReceived?:mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt?: Date;
}

const memberSchema = new Schema<MemberType>({
  role: { type: String, enum: ['ADMIN', 'MODERATOR', 'GUEST'],default:'GUEST' },
  profileId: { type: String },
  profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  serverId: { type: String },
  server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' },
  messages: { type:[mongoose.Schema.Types.ObjectId], ref:"Message" },
  directMessages: { type:[String]},
  conversationsInitiated: { type:[mongoose.Schema.Types.ObjectId], ref:"Conversation" },
  conversationsReceived: { type:[mongoose.Schema.Types.ObjectId], ref:"Conversation" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

const Member = mongoose.models.Member || mongoose.model<MemberType>('Member', memberSchema);

export default Member;

///////////////////////////////////////////
// import mongoose from 'mongoose'
// import Profile from './ProfileModel'
// import Server from './ServerModel'

// const MemberSchema=new mongoose.Schema({
//     role:{
//         type:String,
//         enum:['ADMIN','MODERATOR','GUEST'],
//         default:'GUEST'
//     },
//     profileId:{
//         type:String
//     },
//     profile:{
//         type:mongoose.Schema.Types.ObjectId,
//         rel:Profile
//     },
//     serverId:{
//         type:String
//     },
//     server:{
//         type:mongoose.Schema.Types.ObjectId,
//         rel:Server
//     },
//     createdAt:{
//         type:Date,
//         default:Date.now()
//     },
//     updatedAt:{
//         type:Date
//     }
// })

// const Member=mongoose.models.Member || mongoose.model('Member',MemberSchema)

// export default Member