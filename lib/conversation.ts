import Conversation from "@/app/models/Conversation"

export const getOrCreateCOnversation=async(memberOneId:string,memberTwoId:string)=>{
    let conversation=await findConversation(memberOneId,memberTwoId) || await findConversation(memberTwoId,memberOneId)

    if(!conversation){
        conversation=await createNewConversation(memberOneId,memberTwoId)
    }

    await conversation.populate("memberOne memberTwo")
    await conversation.populate("memberOne.profile memberTwo.profile")
    return conversation
}

const findConversation=async(memberOneId:string,memberTwoId:string)=>{
    try{
        return await Conversation.findOne({
            memberOneId:memberOneId,
            memberTwoId:memberTwoId
        });
    }catch(err){
        return null
    }
}

const createNewConversation=async (memberOneId:string,memberTwoId:string)=>{
    try {
        return await Conversation.create({
            memberOneId:memberOneId,
            memberTwoId:memberTwoId,
            memberOne:memberOneId,
            memberTwo:memberTwoId
        })
    } catch (error) {
        return null;
    }
}