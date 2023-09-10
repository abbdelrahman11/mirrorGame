import { Game } from "../models/game.model";

module.exports = (io: any, socket: any) => {
  const { UpdateTheGame } = require("../utils/game");
  const handledefromPullCardsToTable = async ({
    gameId,
    roomName,
    deleteCards,
    addCards,
    deleteKeyName,
    addKeyName,
  }: any) => {
    const updatedFields = {
      [deleteKeyName]: deleteCards,
      $push: { [addKeyName]: addCards },
      $inc: { activeUserIndex: 1 },
    };
    const cardsUpdate: Game = await UpdateTheGame(gameId, updatedFields);
    io.to(roomName).emit("allCards", [cardsUpdate]);
  };

  socket.on("fromPullCardsToTable", handledefromPullCardsToTable);
};
