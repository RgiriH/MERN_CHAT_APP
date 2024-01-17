const express = require("express")
const {authorizeUser} = require("../middleWare/authMiddleWare.js")
const {sendMessage , allMessage} = require("../controller/messageController.js")
const router = express.Router()

router.route("/").post(authorizeUser , sendMessage )
router.route("/:chatId").get(authorizeUser , allMessage)


module.exports = router