import { initialProfile } from "@/lib/initial-profile"
import Server from '@/app/models/ServerModel'
import {redirect} from 'next/navigation'
import { InitialModal } from "@/components/modals/initial-modal"
import Member from "@/app/models/MemberModel"

const SetupPage=async()=>{
    const profile=await initialProfile(); 
    const member=await Member.findOne({ 
        profile:profile._id,
    })
    if(member){
        const server=await Server.findOne({members:member._id});
        if(server){
            return redirect(`/servers/${server.id}`);
        };
    }
        return (
            <InitialModal/>
        )
}

export default SetupPage