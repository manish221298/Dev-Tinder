const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      // origin: "http://localhost:5173",
      origin: "*",
      methods: ["GET", "POST"]
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);

          // check if chat exist between ids
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            // if not then create
            chat = new Chat({
              participants: [userId, targetUserId],
              message: [],
            });
          }

          //add ne chats
          chat.message.push({
            sendorId: userId,
            text,
          });

          await chat.save(); // save chats
          io.to(roomId).emit("messageReceived", { firstName, text });
        } catch (err) {
          console.log(err);
        }
      }
    );

    socket.on("disconnect", () => { });
  });
};

module.exports = initializeSocket;
