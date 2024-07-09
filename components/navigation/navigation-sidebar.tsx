import { currentProfile } from "@/lib/current-profile";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
import { redirect } from "next/navigation";
import { connectDB } from "@/dbConfig/dbConfig";
import Server from "@/app/models/ServerModel";
import { NavigationAction } from "./navigation-action";
import { NavigationItem } from "./navigation-item";
import { UserButton } from "@clerk/nextjs";
import Member from "@/app/models/MemberModel";

connectDB(); // Connect to database

export const NavigationSidebar = async () => {

    const profile = await currentProfile();
    if (!profile) {
        return redirect("/")
    }
    // console.log(profile)
    const member=await Member.find({profile:profile._id}) 
    const serverPromises = member.map(async (member: any) => {
        return await Server.findById({ _id: member.serverId });
    });

    const allServers = await Promise.all(serverPromises); 
    return (
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
            <NavigationAction />
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md mx-auto w-10" />
            <ScrollArea className="flex-1 w-full">
                {allServers.map((server) => (
                    <div key={server.id} className="mb-4">
                        <NavigationItem
                            id={server.id}
                            name={server.name}
                            imageUrl={server.imageUrl}
                        />
                    </div>
                ))}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle />
                <UserButton 
                afterSignOutUrl="/"
                appearance={{
                    elements:{
                        avatarBox:"h-[48px] w-[48px]"
                    }
                }}
                />

            </div>
        </div>
    );
};
