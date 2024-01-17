const express = require("express")
const {registerUser , authUser , allUsers} = require("../controller/userController")
const { authorizeUser } = require("../middleWare/authMiddleWare");
const router = express.Router()

router.route("/").post(registerUser).get(authorizeUser , allUsers);
    
router.route('/login').post(authUser)



module.exports = router;