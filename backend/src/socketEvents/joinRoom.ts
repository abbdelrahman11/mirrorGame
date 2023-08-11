import { messages } from "../models/messages.model";
import { roomUsers } from "../models/roomUsers.model";

module.exports = (io: any, socket: any) => {
  const { userJoin } = require("../utils/rooms");
  const { formatMessage } = require("../utils/message");
  const handleJoinRoom = (room: roomUsers) => {
    userJoin(room).then((res: any) => {
      // socket.join(res.roomName);
      io.emit("joinedTheRoom", {});
      socket.emit("canJoinRoom", {});
    });

    // const msgToAll: messages = {
    //   username: "ChatCord Bot",
    //   text: `$s has joined the chat`,
    // };
    // formatMessage(msgToAll).then((res: messages) => {
    //   io.to(room.roomName).emit("message", res);
    // });
  };

  socket.on("joinRoom", handleJoinRoom);
};
