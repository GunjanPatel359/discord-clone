"use client"

import { MemberType } from "@/app/models/MemberModel";
import { ChatWelcome } from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { ArrowUp, Loader2, ServerCrash } from "lucide-react";
import { Fragment,useRef,ElementRef } from "react";
import { MessageType } from "@/app/models/MessageModel";
import { ProfileType } from "@/app/models/ProfileModel";
import { ChatItem } from "./chat-item";

import {format} from "date-fns";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

const DATE_FORMAT="d MMM yyyy, HH:mm";

type MessageWithMemberWithProfile=MessageType &{
    member:MemberType &{
        profile:ProfileType
    }
}

interface ChatMessagesProps{
    name:string;
    member:MemberType;
    chatId:string;
    apiUrl:string;
    socketUrl:string;
    socketQuery:Record<string,string>;
    paramKey:"channelId" | "conversationId";
    paramValue:string;
    type:"channel" | "conversation";
}

export const ChatMessages=({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type
}:ChatMessagesProps)=>{
    const queryKey=`chat:${chatId}`;
    const addKey=`chat:${chatId}:messages`;
    const updateKey=`chat:${chatId}:messages:update`

    const chatRef=useRef<ElementRef<"div">>(null)
    const bottomRef=useRef<ElementRef<"div">>(null)

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    }=useChatQuery({
        apiUrl,
        queryKey,
        paramKey,
        paramValue
    });
    console.log(data,fetchNextPage,isFetchingNextPage,status)
    useChatSocket({
        addKey,
        updateKey,
        queryKey
    });
    useChatScroll({
        chatRef,
        bottomRef,
        loadMore:fetchNextPage,
        shouldLoadMore:!isFetchingNextPage && !!hasNextPage,
        count:data?.pages?.[0]?.items?.length ?? 0,
    })

    if(status==='pending'){
        return (
            <div className="flex flex-col flex-1 text-center justify-center gap-2">
                <Loader2  className="h-7 w-7 text-zinc-500 animate-spin mx-auto"/>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Loading messages...
                </p>
            </div>
        )
    }

    if(status==='error'){
        return (
            <div className="flex flex-col flex-1 justify-center">
                <ServerCrash  className="h-7 w-7 text-zinc-500 my-4"/>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Something went wrong!
                </p>
            </div>
        )
    }

    return (
        <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
        {!hasNextPage &&<div className="flex-1" />}
        {!hasNextPage && (<ChatWelcome
        type={type}
        name={name}
        />)}
        {hasNextPage&&(
            <div className="flex justify-center">
                {isFetchingNextPage?(
                    <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4"/>
                ):(
                    <button
                    onClick={()=>fetchNextPage()}
                    className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition">
        <ArrowUp className="w-4 h-4 text-zinc-400/85 dark:text-zinc-500/85 group-hover:text-blue-500/85 group-hover:dark:text-blue-500 transition" />
                        Load previous messages
                    </button>
                )}
            </div>
        )}
        <div className="flex flex-col-reverse mt-auto">
            {data?.pages?.map((group,i):any=>(
                <Fragment key={i}>
                    {group?.items.map((message:MessageWithMemberWithProfile)=>(
                        <>
                        <ChatItem 
                        key={message._id}
                        id={message._id}
                        content={message.content}
                        member={message.member}
                        timestamp={format(new Date(message.createdAt),DATE_FORMAT)}
                        fileUrl={message?.fileUrl} 
                        deleted={message.deleted}
                        currentMember={member}
                        // isUpdated={message?.updatedAt!==message.createdAt}
                        isUpdated={message.updatedAt===undefined?false:true}
                        socketUrl={socketUrl}
                        socketQuery={socketQuery}
                        />
                        </>
                    ))}
                </Fragment>
            ))}
        </div>
        <div ref={bottomRef} />
        </div>
    )
}