import { messages } from "../models/messages.model";
module.exports = (io: any, socket: any) => {
  const { CreateRoom, allRooms } = require("../utils/rooms");
  const { formatMessage } = require("../utils/message");

  const handleCreateRoom = ({
    roomName,
    roomPoints,
    usersId,
    romMembersCount,
  }: any) => {
    const room = { roomName, roomPoints, usersId, romMembersCount };

    CreateRoom(room)
      .then((Roomres: any) => {
        return allRooms(); // Return a new promise to chain with the next `then`
      })
      .then((res: any) => {
        io.emit("allRooms", res);
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  socket.on("createRoom", handleCreateRoom);
};
