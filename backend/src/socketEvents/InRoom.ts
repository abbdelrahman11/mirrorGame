import { roomUsers } from "../models/roomUsers.model";

module.exports = (io: any, socket: any) => {
  const { roomInfo } = require("../utils/rooms");
  const { getAllCards } = require("../utils/cards");
  const handleinRoom = ({ userId, roomName }: any) => {
    console.log(roomName);
    roomInfo(roomName).then((roomRes: any) => {
      socket.join(roomName);
      return getAllCards().then((res: any) => {
        if (roomRes[0].usersId.length == 4) {
          io.to(roomName).emit("AllCards", res);
        }
      });
    });
  };

  socket.on("inRoom", handleinRoom);
};
