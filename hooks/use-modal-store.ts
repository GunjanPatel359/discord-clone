import { ChannelType } from "@/app/models/ChannelModel";
import { ServerType } from "@/app/models/ServerModel";
import {create} from "zustand";

export type ModalType= "createServer" | "invite" | "editServer" | "members" | "createChannel"|"leaveServer" | "deleteServer" | "deleteChannel" | 'editChannel' | "messageFile" | "deleteMessage";

enum channelType{
    TEXT="TEXT",
    AUDIO="AUDIO",
    VIDEO="VIDEO"
}

interface ModalData{
    server?:ServerType
    channel?:ChannelType
    channelType?:channelType;
    apiUrl?:string;
    query?:Record<string,any>
}

interface ModalStore{
    type:ModalType | null;
    data:ModalData;
    isOpen:boolean;
    onOpen:(type:ModalType,data?:ModalData)=> void;
    onClose:()=> void;
} 

export const useModal=create<ModalStore>((set)=>({
    type: null,
    data: {},
    isOpen: false,
    onOpen:(type,data={})=>set({ isOpen:true,type,data}),
    onClose:()=>set({ isOpen:false,type:null})
}))