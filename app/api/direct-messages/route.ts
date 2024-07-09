import { NextResponse } from 'next/server'
import { currentProfile } from '@/lib/current-profile'
import { Message, MessageType } from '@/app/models/MessageModel'
import Member from '@/app/models/MemberModel'
import DirectMessage from '@/app/models/DirectMessage'

const MESSAGES_BATCH = 10

export async function GET(req: Request) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)

    const cursor = searchParams.get('cursor')
    const conversationId = searchParams.get('conversationId')
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!conversationId) {
      return new NextResponse('conversation Id missing', { status: 400 })
    }
    // console.log(conversationId,cursor)
    let messages: any
    if (cursor) {
      messages = await DirectMessage.find({
        conversation: cursor,
      }).populate({path: 'member',populate: {path: 'profile'}}).limit(MESSAGES_BATCH).skip(1).sort({ createdAt: -1 })
    } else {
      messages = await DirectMessage.find({ 
        conversation:conversationId
      }).populate({path: 'member',populate: {path: 'profile'}}).sort({createdAt: -1})
    }
    // console.log(messages)
    let nextCursor = null

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1]._id
    }
    // console.log(messages,nextCursor)
    return NextResponse.json({
      items: messages,
      nextCursor
    })
  } catch (error) {
    console.log('[DIRECT_MESSAGES_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
