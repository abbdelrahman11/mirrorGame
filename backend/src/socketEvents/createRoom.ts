import { Card } from "../models/card.model";
import { Game } from "../models/game.model";
import { room } from "../models/roomUsers.model";

module.exports = (io: any, socket: any) => {
  const { CreateRoom, allRooms, checkTheRoomName } = require("../utils/rooms");
  const { CreateGame } = require("../utils/game");
  const { getAllCards } = require("../utils/cards");
  const handleCreateRoom = async ({
    roomName,
    roomPoints,
    usersId,
    gameId,
  }: room) => {
    const room: room = { roomName, roomPoints, usersId, gameId };
    try {
      await checkTheRoomName(room);
      const gameresCards: Card = await getAllCards();
      const createdGame: Game = await CreateGame({ cards: gameresCards });
      room.gameId = createdGame._id;
      await CreateRoom(room);
      const allRoomsRes: room = await allRooms();
      io.emit("allRooms", allRoomsRes);
      socket.emit("canRoute", createdGame._id);
    } catch (error) {
      socket.emit("allRooms", { error });
    }
  };

  socket.on("createRoom", handleCreateRoom);
};
