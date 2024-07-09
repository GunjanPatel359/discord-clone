import { ChannelType } from "./app/models/ChannelModel";
import { MemberType } from "./app/models/MemberModel";
import { ProfileType } from "./app/models/ProfileModel";
import { ServerType } from "./app/models/ServerModel";

import {Server as NetServer,Socket} from "net";
import { NextApiResponse } from "next";
import {Server as SocketIOServer} from "socket.io";


export type serverWIthMembersWIthProfile=ServerType&{
    members:(MemberType&{profile:ProfileType})[];
}&{
    channel:ChannelType[]
}

export type serverWIthProfile=ServerType&{
    profile:ProfileType;
}

export type NextApiResponseServerIo=NextApiResponse & {
    socket:Socket & {
        server:NetServer & {
            io:SocketIOServer;
        }
    }
}