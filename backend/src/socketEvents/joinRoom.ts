import { room } from "../models/roomUsers.model";

module.exports = (io: any, socket: any) => {
  const { userJoin } = require("../utils/rooms");
  const handleJoinRoom = (room: room) => {
    userJoin(room).then((res: any) => {
      socket.emit("canJoinRoom", {});
    });
  };

  socket.on("joinRoom", handleJoinRoom);
};
