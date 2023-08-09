import { roomUsers } from "../models/roomUsers.model";

module.exports = (io: any, socket: any) => {
  const { userJoin } = require("../utils/rooms");
  const handleJoinRoom = (room: roomUsers) => {
    userJoin(room).then((res: any) => {
      socket.join(res.roomName);
      io.emit("joinedTheRoom", {});
      socket.emit("canJoinRoom", {});
    });
    // return getRoomUsers(res.roomName);
    // .then((getRoomUsers: any) => {
    //    io.emit("joinedTheRoom", {
    //     room: room.roomName,
    //     users: getRoomUsers,
    //   });
    // });

    // Broadcast when a user connects
    // const msgToAll: messages = {
    //   username: "ChatCord Bot",
    //   text: `$s has joined the chat`,
    // };
    // formatMessage(msgToAll).then((res: messages) => {
    //   socket.broadcast.to(room.roomName).emit("message", res);
    // });
  };

  socket.on("joinRoom", handleJoinRoom);
};
