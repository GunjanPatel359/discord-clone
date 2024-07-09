import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { currentProfile } from '@/lib/current-profile'
import Member from '@/app/models/MemberModel'
import { getOrCreateCOnversation } from '@/lib/conversation'
import { ChatHeader } from '@/components/chat/chat-header'
import { ChatMessages } from '@/components/chat/chat-messages'
import { ChatInput } from '@/components/chat/chat-input'
import { MediaRoom } from '@/components/media-room'

interface MemberIdPageProps {
  params: {
    memberId: string
    serverId: string
  }
  searchParams: {
    video?: boolean
  }
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
  const profile = await currentProfile()

  if (!profile) {
    return auth().redirectToSignIn()
  }

  let currentMember = await Member.findOne({
    server: params.serverId,
    profile: profile._id
  }).populate('profile')

  if (!currentMember) {
    return redirect('/')
  }
  let conversation = await getOrCreateCOnversation(
    currentMember._id,
    params.memberId
  )
  if (!conversation) {
    return redirect(`servers/${params.serverId}`)
  }
  const { memberOne, memberTwo } = conversation
  let otherMember =
    memberOne.profile._id.toString() == profile._id.toString()
      ? memberTwo
      : memberOne
  currentMember = JSON.parse(JSON.stringify(currentMember))
  otherMember = JSON.parse(JSON.stringify(otherMember))
  // console.log(currentMember,otherMember)
  return (
    <>
      <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
        <ChatHeader
          imageUrl={otherMember.profile?.imageUrl}
          name={otherMember.profile?.name}
          serverId={params.serverId}
          type='conversation'
        />
        {searchParams.video && (
            <MediaRoom
            chatId={conversation._id}
            video={true}
            audio={true}
            />
        )}
        {!searchParams.video && (
          <>
            <ChatMessages
              member={currentMember}
              name={otherMember.profile.name}
              chatId={JSON.parse(JSON.stringify(conversation._id))}
              type='conversation'
              apiUrl='/api/direct-messages'
              paramKey='conversationId'
              paramValue={JSON.parse(JSON.stringify(conversation._id))}
              socketUrl='/api/socket/direct-messages'
              socketQuery={{
                conversationId: JSON.parse(JSON.stringify(conversation._id))
              }}
            />
            <ChatInput
              name={otherMember.profile.name}
              type='conversation'
              apiUrl='/api/socket/direct-messages'
              query={{
                conversationId: JSON.parse(JSON.stringify(conversation._id))
              }}
            />
          </>
        )}
      </div>
    </>
  )
}

export default MemberIdPage
