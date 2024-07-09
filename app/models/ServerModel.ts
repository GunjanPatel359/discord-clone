import mongoose, { Schema, InferSchemaType } from 'mongoose';
import Profile, { ProfileType } from './ProfileModel';
import Channel from './ChannelModel';
import Member from './MemberModel';

export interface ServerType {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  imageUrl?: string;
  inviteCode?: string;
  members?: mongoose.Schema.Types.ObjectId[]; 
  channel: mongoose.Schema.Types.ObjectId[];
  profileId: ProfileType;
  createdAt: Date;
  updatedAt?: Date;
}

const serverSchema = new Schema<ServerType>({
  name: { type: String, required: true },
  imageUrl: { type: String },
  inviteCode: { type: String },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Member'
  },
  channel: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Channel'
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

const Server = mongoose.models.Server || mongoose.model<ServerType>('Server', serverSchema);

export default Server;



//////////////////////////////////////
// import mongoose from 'mongoose'
// import Profile from './ProfileModel'

// const ServerSchema=new mongoose.Schema({
//     name:{
//         type:String,
//         required:true
//     },
//     imageUrl:{
//         type:String
//     },
//     inviteCode:{
//         type:String
//     },
//     members:{
//         type: [mongoose.Schema.Types.ObjectId]
//     },
//     channel:{
//         type: [mongoose.Schema.Types.ObjectId]
//     },
//     profileId:{
//         type:mongoose.Schema.Types.ObjectId,
//         rel:Profile
//     },
//     createdAt:{
//         type:Date,
//         default:Date.now()
//     },
//     updatedAt:{
//         type:Date
//     }
// })

// const Server=mongoose.models.Server || mongoose.model('Server',ServerSchema)

// export default Server