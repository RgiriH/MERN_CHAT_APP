const asyncHandler = require("express-async-handler")
const User = require("../modules/userModel")
const Chat = require("../modules/chatModel")
const Message = require("../modules/messageModel")


const sendMessage = asyncHandler(async( req,res) => {
    const { chatId, content } = req?.body
    
    if (!chatId || !content) {
        res.status(404)
        throw new Error("invalid parameters")
    }
    const isUserInChat = Chat.find({
        _id: chatId,
        users : {$elemMatch : {$eq : req.user._id}}
    })
    if (!isUserInChat) {
        res.status(404)
        throw new Error("Not allowed to send message in this group")
    }

    const messageContent = {
        sender: req.user._id,
        content,
        chat : chatId
    }

    try {
        let message = await Message.create(messageContent)
        
        message = await message.populate("sender", "name pic email")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: "chat.users",
            select : "name pic email"
        })

        await Chat.findOneAndUpdate(
          {
            _id: chatId,
          },
          {
            latestMessage : message
          }
        );
        
       res.status(200).json(message);
    } catch (error) {
         res.status(500)
         throw new Error(error.message);
    }
})

const allMessage = asyncHandler(async (req, res) => {
    const { chatId } = req.params
   try {
       const messages = await Message.find({
          chat : chatId 
       }).populate("sender", "name email pic")
           .populate("chat")
       
       return res.status(200).json(messages)
   } catch (error) {
       res.status(500)
       throw new Error("internal server error")
   }
})

module.exports = {sendMessage , allMessage}