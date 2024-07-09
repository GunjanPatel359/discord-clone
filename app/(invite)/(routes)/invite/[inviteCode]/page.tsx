import Member from "@/app/models/MemberModel";
import Server from "@/app/models/ServerModel";
import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";

interface InviteCodePageProps{
    params:{
        inviteCode:string;
    };
};

const InviteCodePage=async({
    params
}:InviteCodePageProps)=>{

    const profile=await currentProfile();

    if(!profile){
        return auth().redirectToSignIn()
    }
    if(!params.inviteCode){
        return redirect("/");
    }
    const existingServer=await Server.findOne({inviteCode:params.inviteCode})

    if(existingServer){

        const alreadymember=await Member.findOne({
            serverId:existingServer._id,
            profile:profile._id
        })

        if(alreadymember){
            return redirect(`/servers/${existingServer._id}`);
        }
        const member=await Member.create({
            profile:profile._id,
            serverId:existingServer._id,
            server:existingServer._id,
        })
        const server=await Server.findOneAndUpdate({
            inviteCode:params.inviteCode
        },{
            $push:{members:member._id}
        })
        return redirect(`/servers/${server._id}`)

    }

    return (
        <div>
            null;
        </div>
    )
}

export default InviteCodePage;