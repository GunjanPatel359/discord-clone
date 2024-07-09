import Channel from '@/app/models/ChannelModel'
import Member from '@/app/models/MemberModel'
import Server from '@/app/models/ServerModel'
import { ChatHeader } from '@/components/chat/chat-header'
import { ChatInput } from '@/components/chat/chat-input'
import { ChatMessages } from '@/components/chat/chat-messages'
import { MediaRoom } from '@/components/media-room'
import { currentProfile } from '@/lib/current-profile'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

interface ChannelIdPageProps {
  params: {
    serverId: string
    channelId: string
  }
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile()
  if (!profile) {
    return auth().redirectToSignIn()
  }

  const channel = await Channel.findOne({
    _id: params.channelId
  })

  let member = await Member.findOne({
    profile: profile._id,
    server: params.serverId
  })

  if (!channel || !member) {
    redirect('/')
  }
  member = JSON.parse(JSON.stringify(member))
  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type='channel'
      />
      {channel.channeltype == 'TEXT' && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={JSON.parse(JSON.stringify(channel._id))}
            type='channel'
            apiUrl='/api/messages'
            socketUrl='/api/socket/messages'
            socketQuery={{
              channelId: JSON.parse(JSON.stringify(channel._id)),
              serverId: channel.serverId
            }}
            paramKey='channelId'
            paramValue={JSON.parse(JSON.stringify(channel._id))}
          />
          <ChatInput
            name={channel.name}
            type='channel'
            apiUrl='/api/socket/messages'
            query={{
              channelId: JSON.parse(JSON.stringify(channel._id)),
              serverId: channel.serverId
            }}
          />
        </>
      )}
      {channel.channeltype=='AUDIO' && (
        <MediaRoom
        chatId={JSON.parse(JSON.stringify(channel._id))}
        video={false}
        audio={true}
        />
      )}
      {channel.channeltype=='VIDEO' && (
        <MediaRoom
        chatId={JSON.parse(JSON.stringify(channel._id))}
        video={true}
        audio={false}
        />
      )}
    </div>
  )
}

export default ChannelIdPage
