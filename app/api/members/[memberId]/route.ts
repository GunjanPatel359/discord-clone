import Member from "@/app/models/MemberModel";
import Server from "@/app/models/ServerModel";
import { currentProfile } from "@/lib/current-profile"
import { NextResponse } from "next/server"

export async function DELETE(
    req: Request,
    {params}:{params:{memberId:string}}
){
    try {
        const profile=await currentProfile();
        const {searchParams}=new URL(req.url);
        const serverId=searchParams.get("serverId");
        if(!profile){
            return NextResponse.json("Unauthorized",{status:401})
        }
        if(!serverId){
            return new NextResponse("Server ID missing",{status:400});
        }
        if(!params.memberId){
            return new NextResponse("Member TD missing",{status:400});
        }
        const server=await Server.findOne({
            _id:serverId
        })
        if((server.profileId).toString() !== (profile._id).toString()){
            return new NextResponse("Access Unauthorized",{status:401});
        }
        if(server.profileId==params.memberId){
            return new NextResponse("Cannot do self kick",{status:401})
        }
        const member=await Member.findByIdAndDelete({
            _id:params.memberId
        })
        const newserver=await Server.findByIdAndUpdate({
            _id:serverId
        },{
            $pull:{members:member._id}
        },{new:true})
        return NextResponse.json(member);
    } catch (error) {
        console.log("[MEMBER_ID_DELETE]",error)
        return new NextResponse("Internal Error",{status:500})
    }
}

export async function PATCH(
    req:Request,
    {params}:{params:{memberId:string}}
){
    try {
        const profile=await currentProfile();
        if(!profile){
            return new NextResponse("Unauthorized",{status:401});
        }
        const {searchParams}=new URL(req.url)
        const serverId=searchParams.get("serverId")
        const role=searchParams.get("role")
        if(!serverId){
            return new NextResponse("Server ID missing",{status:400});
        }
        if(!params.memberId){
            return new NextResponse("Member ID missing",{status:400});
        }
        const server=await Server.findOne({
            _id:serverId
        })
        if((server.profileId).toString() !== (profile._id).toString()){
            return new NextResponse("Access Unauthorized",{status:401});
        }
        if(server.profileId==params.memberId){
            return new NextResponse("Cannot modify own profile",{status:401})
        }
        const member=await Member.findOneAndUpdate({
            _id:params.memberId,
            server:server._id,
        },{
            role
        },{new:true})
        return NextResponse.json(member)

    } catch (error) {
       console.log("[MEMBERS_ID_PATCH]",error) 
       return new NextResponse("Internal Error",{status:500})
    }
}