const asyncHandler = require("express-async-handler")
const User = require("../modules/userModel")
const {creatToken} = require("../config/creatToken")

const registerUser = asyncHandler(async (req , res ) => {
    const { name, email, password, pic } = req?.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      res.status(400);
      throw new Error("user alread exist");
    }

    const user = await User.create({
      name,
      email,
      password,
      pic,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        jwtToken : creatToken(user._id)
      });
    } else {
      res.status(400);
      throw new Error("failed to creat user");
    }
})

const authUser = asyncHandler(async(req ,res) => {
    const { email, password } = req.body
    
    const user = await User.findOne({ email });

    if (!user || await user.matchPassword(password) === false) {
        
       res.status(400);
        throw new Error("user not found");
      
    } else {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        jwtToken: creatToken(user._id),
      });
    }
    
})

const allUsers = asyncHandler(async (req, res) => {
  

  try {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

   const users = await User.find(
     keyword
   ).find({ _id: { $ne: req.user._id } });
    
    
   res.status(200).send(users)
} catch (error) {
  res.status(500)
  throw new Error("internal server Error")
}    
})


module.exports = { registerUser , authUser , allUsers};