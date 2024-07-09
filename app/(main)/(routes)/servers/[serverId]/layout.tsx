import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Server from "@/app/models/ServerModel";
import Member from "@/app/models/MemberModel";
import { ServerSidebar } from "@/components/server/server-sidebar";
// import { connectDB } from "@/dbConfig/dbConfig";
// connectDB()

const ServerIdLayout= async({
    children,
    params
}:{
    children:React.ReactNode;
    params:{serverId:string}
})=>{
    const profile = await currentProfile()
    if(!profile){
        return auth().redirectToSignIn()
    }

    const member=await Member.find({profile:profile._id,serverId:params.serverId})

    if(!member){
        return redirect("/")
    }

    return (
        <div className="h-full">
            <div 
            className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <ServerSidebar serverId={params.serverId} />
            </div>
            <main className="h-full md:pl-60">
            {children}
            </main>
        </div>
    );
}

export default ServerIdLayout;