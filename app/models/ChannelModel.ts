import mongoose, { Schema } from 'mongoose';
import  Profile  from './ProfileModel';
import  Server  from './ServerModel'; 

export interface ChannelType {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  channeltype?: string;
  profileId?: string; 
  profile: mongoose.Schema.Types.ObjectId;
  serverId?: string; 
  server?: mongoose.Schema.Types.ObjectId;
  messages?:mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt?: Date;
}

const channelSchema = new Schema<ChannelType>({
  name: { type: String, required: true },
  channeltype: { type: String, enum: ['TEXT', 'AUDIO', 'VIDEO'],default:'TEXT' },
  profileId: { type: String, optional: true },
  profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  serverId: { type: String, optional: true },
  server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' },
  messages: { type: [mongoose.Schema.Types.ObjectId], ref: 'Message' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

const Channel = mongoose.models.Channel || mongoose.model<ChannelType>('Channel', channelSchema);

export default Channel;

///////////////////////////////////////
// import mongoose from 'mongoose'
// import Profile from './ProfileModel'
// import Server from './ServerModel'

// const ChannelSchema=new mongoose.Schema({
//     name:{
//         type:String
//     },
//     channeltype:{
//         type:String,
//         enum:['TEXT','AUDIO','VIDEO'],
//         default:'TEXT'
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

// const Channel=mongoose.models.Channel || mongoose.model('Channel',ChannelSchema)

// export default Channel