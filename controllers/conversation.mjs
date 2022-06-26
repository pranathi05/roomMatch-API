import conversation from '../models/conversation.mjs';

export const getConversation = async (req,res)=>{
    try{
        const convo = await conversation.find({
            members: {$in:[req.params.userId] },
        });
        res.status(200).json(convo);
    }catch(err){
        res.status(500).json(err)
    }
}

export const postConversation = async (req, res) =>{
    const newConversation = new conversation(
    {members: [req.body.senderId, req.body.receiverId],
    });
    try{
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    }catch(err){
        res.status(500).json(err)
    }
}