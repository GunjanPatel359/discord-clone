import mongoose, { Schema } from 'mongoose';
import Server from './ServerModel'; 

export interface ProfileType {
    _id: mongoose.Schema.Types.ObjectId;
    profileId: string;
    name: string;
    imageUrl?: string;
    email: string;
    createdAt: Date;
    updatedAt?: Date;
    servers: mongoose.Schema.Types.ObjectId[];
    members: mongoose.Schema.Types.ObjectId[];
    channel: mongoose.Schema.Types.ObjectId[];
}

const profileSchema = new Schema<ProfileType>({
    profileId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    imageUrl: { type: String },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    servers: {
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'Server'
    },
    // members: {
    //     type: [mongoose.Schema.Types.ObjectId],
    //     ref: 'Member'
    // },
    // channel: {
    //     type: [mongoose.Schema.Types.ObjectId],
    //     ref: 'Channel'
    // },
});

const Profile = mongoose.models.Profile || mongoose.model<ProfileType>('Profile', profileSchema);

export default Profile;

///////////////////////////////////////////
// import mongoose,{InferSchemaType} from 'mongoose'

// const ProfileSchema=new mongoose.Schema({
//     ProfileId:{
//         type:String,
//         required:true,
//         unique:true
//     },
//     name:{
//         type:String,
//         required:true,
//     },
//     imageUrl:{
//         type:String
//     },
//     email:{
//         type:String,
//         required:true
//     },
//     createdAt:{
//         type:Date,
//         default:Date.now()
//     },
//     updatedAt:{
//         type:Date
//     },
//     servers:{
//         type: [mongoose.Schema.Types.ObjectId]
//     },
//     members:{
//         type: [mongoose.Schema.Types.ObjectId]
//     },
//     channel:{
//         type: [mongoose.Schema.Types.ObjectId]
//     }
// })

// const Profile=mongoose.models.Profile || mongoose.model('Profile',ProfileSchema)

// export default Profile
// //////////////////////////////////////////////////
