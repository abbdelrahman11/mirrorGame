import { Card } from "../models/card.model";
import { Game } from "../models/game.model";
import { Points } from "../models/results";

module.exports = (io: any, socket: any) => {
  const {
    UpdateTheGame,
    cardsSum,
    getGame,
    deleteTheGame,
  } = require("../utils/game");
  const { create, getResult, getSumOfResult } = require("../utils/result");
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
    await create({ round: sum[0], roomName });
    const result = await getResult(roomName);
    const sumOfresult = await getSumOfResult(roomName);
    await deleteTheGame(gameId);
    if (checkTheResult(sumOfresult[0])) {
      const gameresCards: Card = await getAllCards();
      const createdGame: Game = await CreateGame({ cards: gameresCards });
      io.to(roomName).emit("showtheResult", result);
      io.to(roomName).emit("newGame", createdGame._id);
    } else {
      io.to(roomName).emit("canStartTheGame", false);
    }
    console.log(sumOfresult);
  };
  function checkTheResult(sumOfresult: Points) {
    let StartTheGame: boolean = true;
    for (const [key, value] of Object.entries(sumOfresult)) {
      if (value > 100) {
        StartTheGame = false;
      }
    }
    return StartTheGame;
  }
  socket.on("finishTheRound", handlefinishTheRound);
  socket.on("roundFinished", handlegaameFinished);
};
