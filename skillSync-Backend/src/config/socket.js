const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Chat = require("../models/chat");

const onlineUsers = new Map();
//connect backend
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://skillsyncdev.netlify.app",
  "https://skillsync-developer.netlify.app",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.replace(/\/$/, "")] : []),
];

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/$/, "");
        if (allowedOrigins.includes(cleanOrigin)) {
          return callback(null, true);
        }
        return callback(null, origin);
      },
      credentials: true,
    }
  });
//check login then jwt
  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      const token = cookieHeader?.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
      if (!token) return next(new Error("Token not found"));

      const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decodedObj._id).select("firstName lastName photoUrl");
      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch (err) {
      next(err);
    }
  });
//show connection
  io.on("connection", (socket) => {
    const userIdStr = socket.user._id.toString();
    const count = onlineUsers.get(userIdStr) || 0;
    onlineUsers.set(userIdStr, count + 1);

    io.emit("user_status_change", { userId: userIdStr, isOnline: true });
    socket.emit("online_users", Array.from(onlineUsers.keys()));
//setup connection 2 user
    socket.on("join_chat", ({ targetUserId }) => {
      const roomId = [socket.user._id.toString(), targetUserId.toString()].sort().join("_");
      socket.join(roomId);
    });

    socket.on("send_message", async ({ targetUserId, text }) => {
      try {
        const roomId = [socket.user._id.toString(), targetUserId.toString()].sort().join("_");

        let chat = await Chat.findOneAndUpdate(
          { participants: { $all: [socket.user._id, targetUserId] } },
          { 
            $push: { messages: { senderId: socket.user._id, text } },
            $setOnInsert: { participants: [socket.user._id, targetUserId] }
          },
          { new: true, upsert: true }
        ).populate("messages.senderId", "firstName lastName photoUrl");

        const savedMessage = chat.messages[chat.messages.length - 1];
        io.to(roomId).emit("receive_message", savedMessage);
      } catch (err) {
        console.error("Socket error:", err);
      }
    });
//user disconnect
    socket.on("disconnect", () => {
      const currentCount = onlineUsers.get(userIdStr) || 1;
      if (currentCount <= 1) {
        onlineUsers.delete(userIdStr);
        io.emit("user_status_change", { userId: userIdStr, isOnline: false });
      } else {
        onlineUsers.set(userIdStr, currentCount - 1);
      }
    });
  });

  return io;
};

module.exports = initializeSocket;
