import { Card } from "../models/card.model";
import { Game } from "../models/game.model";

module.exports = (io: any, socket: any) => {
  const {
    UpdateTheGame,
    cardsSum,
    getGame,
    deleteTheGame,
  } = require("../utils/game");
  const { create, getResult } = require("../utils/result");
  const { CreateGame } = require("../utils/game");
  const { getAllCards } = require("../utils/cards");
  const handlefinishTheRound = async ({ gameId, playersIndex }: any) => {
    const updatedFields = {
      finishTheRound: playersIndex,
    };
    await UpdateTheGame(gameId, updatedFields);
  };
  const handlegaameFinished = async ({ gameId, roomName }: any) => {
    const sum = await cardsSum(gameId);
    await create({ round: sum, roomName });
    const result = await getResult(roomName);
    await deleteTheGame(gameId);
    const gameresCards: Card = await getAllCards();
    const createdGame: Game = await CreateGame({ cards: gameresCards });
    io.to(roomName).emit("showtheResult", result);
    io.to(roomName).emit("hideThePage", true);
    io.to(roomName).emit("newGame", createdGame._id);
  };
  const handlecheckIfRoundFinished = async ({ gameId, roomName }: any) => {
    const res = await getGame(gameId);
    if (res[0].finishTheRound != 0) {
      const result = await getResult(roomName);
      socket.emit("showtheResult", result);
      socket.emit("hideThePage", true);
    }
  };
  socket.on("finishTheRound", handlefinishTheRound);
  socket.on("roundFinished", handlegaameFinished);
  socket.on("checkIfRoundFinished", handlecheckIfRoundFinished);
};
