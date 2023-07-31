import { roomUsers } from "../models/roomUsers.model";
import { messages } from "../models/messages.model";

module.exports = (io: any, socket: any) => {
  const { userJoin, getRoomUsers } = require("../utils/users");
  const { formatMessage } = require("../utils/message");
  const handleJoinRoom = ({ user_id, username, room }: any) => {
    const user = { user_id, username, room };
    userJoin(user).then((res: roomUsers) => {
      socket.join(res.room);
    });

    // Welcome current user
    const msg: messages = {
      username: "ChatCord Bot",
      text: "Welcome to ChatCord!",
    };
    formatMessage(msg).then((res: messages) => {
      socket.emit("message", res);
    });

    // Broadcast when a user connects
    const msgToAll: messages = {
      username: "ChatCord Bot",
      text: `${user.username} has joined the chat`,
    };
    formatMessage(msgToAll).then((res: messages) => {
      socket.emit("message", res);
    });

    // Send users and room info
    getRoomUsers(user.room).then((res: any) => {
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: res,
      });
    });
  };

  socket.on("joinRoom", handleJoinRoom);
};
