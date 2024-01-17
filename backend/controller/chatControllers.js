const asyncHandler = require("express-async-handler")

const Chat = require("../modules/chatModel")
const User = require("../modules/userModel")
const Message = require("../modules/messageModel")

const accessChat = asyncHandler(async (req , res ) => {
    const { userId } = req.body

    if (!userId) {
      return  res.status(400)
    }
    
    const keyword = {
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq : userId }} },
        { users: { $elemMatch: { $eq : req.user._id} } },
      ],
    };

    let isChat = await Chat.find(keyword)
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      res.status(200).send(isChat[0]);
    } else {
      try {
        let chat = await Chat.create({
          chatName: "sender",
          isGroupChat: false,
          users: [userId, req.user._id],
        });
        let fullChat = await Chat.find({ _id: chat._id })
          .populate("users", "-password")
          .populate("latestMessage");

        res.status(200).send(fullChat[0]);
      } catch (error) {
        res.status(500);
        throw new Error(error.message);
      }
    }
    
})

const fetchChats = asyncHandler(async(req , res) => {
    try {

        let allChats = await Chat.find({
          users: { $elemMatch: { $eq: req.user._id } },
        })
          .populate("users", "-password")
          .populate("groupAdmin", "-password")
          .populate("latestMessage")
            .sort({ updatedAt: -1 });
        
        allChats = await User.populate(allChats, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
    
        res.status(200).send(allChats);
    } catch (error) {
        res.status(500)
        throw new Error("Server error has accured")
    }
})

const creatGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.name || !req.body.users) {
        res.status(404)
        throw new Error("Fill all the field")
    }
    const users = JSON.parse(req.body.users)
    
    if (users.length < 2) {
        res.status(404);
        throw new Error("required atleast 2 users to creat group");
    }

    users.push(req.user._id);

    try {
        const group = await Chat.create({
          chatName: req.body.name,
          isGroupChat: true,
          users: users,
          groupAdmin : req.user
        });

         let groupChat = await Chat.find({
            _id : group._id
         })
           .populate("users", "-password")
           .populate("groupAdmin", "-password")
           .populate("latestMessage");

        res.status(200).send(groupChat)

    } catch (error) {
        res.status(500);
        throw new Error(error);
    }

})

const changeGroupName = asyncHandler(async (req , res ) => {
    const { id , newName } = req.body;

    if (!id || !newName) {
         res.status(404);
         throw new Error("group id or new Name is not provided");
    }

    try {
        const group = await Chat.findOneAndUpdate(
          { _id: id },
          { $set: { chatName : newName} }
        );

        let groupChat = await Chat.find({
          _id: id,
        })
          .populate("users", "-password")
          .populate("groupAdmin", "-password")
            .populate("latestMessage");
         
        res.status(200).send(groupChat);

    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

const addToGroup = asyncHandler(async (req , res) => {
    const { groupId, userId } = req.body
    
    if (!groupId || !userId) {
        res.status(404);
        throw new Error("please group ans user do remove");
    }
    try {
        const group = await Chat.findOneAndUpdate(
            { _id: groupId },
            {$push : {users : userId}}
            
        );


    let groupChat = await Chat.find({
      _id: groupId,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage");

    res.status(200).send(groupChat);

    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }


})


const removeFromGroup = asyncHandler(async (req, res) => {
  const { groupId, userId } = req.body;

  if (!groupId || !userId) {
    res.status(404);
    throw new Error("please group ans user do remove");
  }
  try {
    const group = await Chat.findOneAndUpdate(
      { _id: groupId },
      { $pull : { users : userId} }
    );

    let groupChat = await Chat.find({
      _id: groupId,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage");

    res.status(200).send(groupChat);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const changeGroupAdmin = asyncHandler(async(req,res) => {
  const { groupId, newAdminId } = req.body
  const { _id } = req.user
  
  if (!groupId || !newAdminId) {
    res.status(400)
    throw new Error("all required details are not sent")
  }

  try {
    const group = await Chat.find({
      _id: groupId,
      users: {
        $elemMatch: { $eq: newAdminId }
      },
      groupAdmin: _id
    })

    if (group) {
       try {
         const newGroup = await Chat.findOneAndUpdate({
          _id : groupId
         },
           {
             groupAdmin : newAdminId
           },
         )

         const data = await Chat.find({ _id: groupId })
           .populate("users", "-password")
           .populate("groupAdmin", "-password")
           .populate("latestMessage");


         res.status(200).json(data)
       } catch (error) {
        res.status(500);
        throw new Error("internal server error");
       }
    }
    else {
      res.status(400)
      throw new Error("invalid Attempt")
    }
  } catch (error) {
    res.status(400);
    throw new Error("invalid Attempt");
  }
}
)
module.exports = {
    accessChat,
    fetchChats,
    creatGroupChat,
    changeGroupName,
    addToGroup,
   removeFromGroup,
    changeGroupAdmin
};