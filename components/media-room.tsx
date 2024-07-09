"use client"

import { useEffect,useState } from "react"
import {
    LiveKitRoom,
    useTracks,
    GridLayout,
    ParticipantTile,
    VideoConference
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles"
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps{
    chatId:string;
    video:boolean;
    audio:boolean;
};


function MyVideoConference() {
    // `useTracks` returns all camera and screen share tracks. If a user
    // joins without a published camera track, a placeholder track is returned.
    const tracks = useTracks(
      [
        { source: Track.Source.Camera, withPlaceholder: true },
        { source: Track.Source.ScreenShare, withPlaceholder: false },
      ],
      { onlySubscribed: false },
    );
    return (
      <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
        {/* The GridLayout accepts zero or one child. The child is used
        as a template to render all passed in tracks. */}
        <ParticipantTile />
      </GridLayout>
    );
  }

export const MediaRoom = ({
    chatId,
    video,
    audio
}:MediaRoomProps)=>{
    const user = useUser();
    const [token,setToken]=useState("");

    useEffect(()=>{
        // @ts-ignore
        if(!user?.firstName || !user.lastName) return;
        
        // @ts-ignore
        const name=`${user.firstName} ${user.lastName}`

        (async()=>{
            try {
               const resp=await fetch(`/api/livekit?room=${chatId}&username=${name}`) 
               const data=await resp.json()
               setToken(data.token)
            } catch (e) {
                console.log(e)
            }
        })()
    //@ts-ignore
    },[user?.firstName,user?.lastName,chatId])

    if(token === ""){
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2
                className="h-7 w-7 text-zinc-500 animate-spin my-4"
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Loading...
                </p>
            </div>
        )
    }

    return (
        <LiveKitRoom
        data-lk-theme="default"
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        token={token}
        connect={true}
        video={video}
        audio={audio}
        style={{ height: '100dvh' }}
        >
            {/* <VideoConference/> */}
            <MyVideoConference />
        </LiveKitRoom>
    )
}