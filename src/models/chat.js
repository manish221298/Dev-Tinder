const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, rqeuired: true },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  message: [messageSchema],
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = { Chat };
