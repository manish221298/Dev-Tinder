const { Chat } = require("../models/chat");
const mongoose = require("mongoose");

const chatController = {};

chatController.list = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const targetUserId = new mongoose.Types.ObjectId(req.params.targetUserId);

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate("message.sendorId", "firstName");

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId], // Ensure proper array format
        message: [],
      });
      await chat.save();
    }

    const chatData = chat?.message?.map((msg) => ({
      userId: msg.sendorId?._id || null,
      firstName: msg.sendorId?.firstName || "Unknown",
      text: msg.text,
      createdAt: msg.createdAt,
    }));

    res.status(200).json(chatData);
  } catch (err) {
    console.error("Error fetching chat:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = chatController;
