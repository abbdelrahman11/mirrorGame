import { roomUsers } from "../models/roomUsers.model";

module.exports = (io: any, socket: any) => {
  const { userJoin } = require("../utils/rooms");
  const handleJoinRoom = (room: roomUsers) => {
    userJoin(room).then((res: any) => {
      io.emit("joinedTheRoom", {});
      socket.emit("canJoinRoom", {});
    });
  };

  socket.on("joinRoom", handleJoinRoom);
};
