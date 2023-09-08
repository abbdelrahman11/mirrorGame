import { roomUsers } from "../models/roomUsers.model";

module.exports = (io: any, socket: any, callback: any) => {
  const { CreateRoom, allRooms, checkTheRoomName } = require("../utils/rooms");
  const { CreateGame } = require("../utils/game");
  const { getAllCards } = require("../utils/cards");
  const handleCreateRoom = async ({
    roomName,
    roomPoints,
    usersId,
    gameId,
  }: any) => {
    const room = { roomName, roomPoints, usersId, gameId };
    try {
      await checkTheRoomName(room);
      const gameresCards = await getAllCards();
      const createdGame = await CreateGame({ cards: gameresCards });
      room.gameId = createdGame._id;
      await CreateRoom(room);
      const allRoomsRes = await allRooms();
      io.emit("allRooms", allRoomsRes);
      socket.emit("canRoute", createdGame._id);
    } catch (error) {
      socket.emit("allRooms", { error });
    }
  };

  socket.on("createRoom", handleCreateRoom);
};
