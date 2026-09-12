const express = require("express");
const chatRouter = express.Router();
const Chat = require("../models/chat");
const { userAuth } = require("../middlewares/auth");

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const targetUserId = req.params.targetUserId;

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    })
      .populate("participants", "firstName lastName photoUrl age gender about")
      .populate("messages.senderId", "firstName lastName photoUrl");

    if (!chat) {
      chat = await Chat.create({ participants: [userId, targetUserId], messages: [] });
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = chatRouter;
