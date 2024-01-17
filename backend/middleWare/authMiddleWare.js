const jwt = require("jsonwebtoken")
const User = require("../modules/userModel")
const asyncHandler = require("express-async-handler")


const authorizeUser = asyncHandler(async (req, res , next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
        try {
          
            const decoded = jwt.verify(token, process.env.JWT_KEY)
            const user = await User.findById(decoded.id);
            req.user = user
            next()
        } catch (error) {
            res.status(400)
            throw new Error("authorization is failed")
        }
    }
    else {
         res.status(400);
         throw new Error("authorization failed");
    }
})

module.exports = {authorizeUser}