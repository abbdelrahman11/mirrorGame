import { Card } from "../models/card.model";
import { Game } from "../models/game.model";
import { Points } from "../models/results";

module.exports = (io: any, socket: any) => {
  const { UpdateTheGame, cardsSum, deleteTheGame } = require("../utils/game");
  const { create, getSumOfResult, getResult } = require("../utils/result");
  const { CreateGame } = require("../utils/game");
  const { getAllCards } = require("../utils/cards");
  const { deleteTheRoom } = require("../utils/rooms");
  const handlefinishTheRound = async ({ gameId, playersIndex }: any) => {
    const updatedFields = {
      finishTheRound: playersIndex,
    };
    await UpdateTheGame(gameId, updatedFields);
  };
  const handlegaameFinished = async ({ gameId, roomName, roomPoints }: any) => {
    const sum = await cardsSum(gameId);
    await create({ round: changeSmallestToZero(sum[0]), roomName });
    const sumOfresult = await getSumOfResult(roomName);
    await deleteTheGame(gameId);
    if (checkTheResult(sumOfresult[0], roomPoints)) {
      const gameresCards: Card = await getAllCards();
      const createdGame: Game = await CreateGame({ cards: gameresCards });
      io.to(roomName).emit("newRound", createdGame._id);
    } else {
      const result = await getResult(roomName);
      io.to(roomName).emit("showtheResult", result);
      // await deleteTheRoom(roomName);
      io.to(roomName).emit("canStartTheGame", false);
    }
  };
  function checkTheResult(sumOfresult: Points, roomPoints: number) {
    let StartTheGame: boolean = true;
    for (const [key, value] of Object.entries(sumOfresult)) {
      if (value > roomPoints) {
        StartTheGame = false;
      }
    }

    return StartTheGame;
  }
  function changeSmallestToZero(obj: any) {
    let smallestKey = null;
    let smallestValue = Infinity;
    for (let key in obj) {
      if (
        obj.hasOwnProperty(key) &&
        typeof obj[key] === "number" &&
        obj[key] < smallestValue
      ) {
        smallestKey = key;
        smallestValue = obj[key];
      }
    }

    if (smallestKey !== null) {
      obj[smallestKey] = 0;
    }

    return obj;
  }

  socket.on("finishTheRound", handlefinishTheRound);
  socket.on("roundFinished", handlegaameFinished);
};
