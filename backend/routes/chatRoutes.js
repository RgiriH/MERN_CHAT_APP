const express = require("express");
const { authorizeUser } = require("../middleWare/authMiddleWare");
const {
  accessChat,
  fetchChats,
  creatGroupChat,
  changeGroupName,
  addToGroup,
  removeFromGroup,
  changeGroupAdmin
} = require("../controller/chatControllers");


const router = express.Router()

router.route("/").post(authorizeUser, accessChat)
    .get(authorizeUser, fetchChats);

router.route("/group").post(authorizeUser, creatGroupChat);
router.route("/rename").put(authorizeUser, changeGroupName);
router.route("/add").put(authorizeUser, addToGroup);
router.route("/remove").put(authorizeUser, removeFromGroup);
router.route("/changeAdmin").put(authorizeUser,changeGroupAdmin)


module.exports = router