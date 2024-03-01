import { Game } from "../models/game.model";

module.exports = (io: any, socket: any) => {
  const { roomInfo } = require("../utils/rooms");
  const { getGame, UpdateTheGame } = require("../utils/game");
  const { getResult } = require("../utils/result");
  const handleinRoom = async ({ userId, roomName, gameId }: any) => {
    try {
      const roomRes = await roomInfo(roomName);
      const theGame = await getGame(gameId);
      if (theGame[0].gameStarted) {
        gameStarted(userId, roomRes, theGame, roomName);
      } else {
        await HandOutTheCardsToThePlayers(
          userId,
          roomName,
          gameId,
          theGame,
          roomRes
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function gameStarted(
    userId: any,
    roomRes: any,
    theGame: any,
    roomName: string
  ) {
    const result = await getResult(roomName);
    socket.join(roomName);
    const userIndex = roomRes[0].usersId.indexOf(userId);
    socket.emit("playerIndex", userIndex + 1);
    socket.emit("allCards", theGame);
    socket.emit("showtheResult", result);
  }

  async function HandOutTheCardsToThePlayers(
    userId: string,
    roomName: string,
    gameId: string,
    theGame: any,
    roomRes: any
  ) {
    socket.join(roomName);
    if (theGame.length > 0) {
      const userIndex = roomRes[0].usersId.indexOf(userId);

      const updatedFields = {
        [`player${userIndex + 1}`]: getRandomNumbers(
          theGame[0].cards,
          userIndex
        ),
        $inc: { gameMembersCount: 1 },
      };
      const updatedGame = await UpdateTheGame(gameId, updatedFields);
      socket.emit("playerIndex", userIndex + 1);
      io.to(roomName).emit("playersInTheRoom", roomRes[0].usersId.length);
      if (roomRes[0].usersId.length == 4 && updatedGame.gameMembersCount > 3) {
        await RoomIsComplete(updatedGame, gameId, roomName);
      }
    }
  }

  async function RoomIsComplete(
    theGame: Game,
    gameId: string,
    roomName: string
  ) {
    let gameCards = [...theGame.cards];

    getPullCards(theGame.cards, 17);
    const updatedFields = {
      gameStarted: true,
      pullCards: theGame.cards,
      tableCards: getTableCards(gameCards),
    };
    const theGameUpdate = await UpdateTheGame(gameId, updatedFields);
    io.to(roomName).emit("allCards", [theGameUpdate]);
    const result = await getResult(roomName);
    io.to(roomName).emit("showtheResult", result);
  }

  function getRandomNumbers(arr: Array<any>, count: number) {
    let randomNumbers;
    randomNumbers = arr.slice(count * 4, (count + 1) * 4);
    return randomNumbers;
  }
  function getTableCards(arr: Array<any>) {
    let randomNumbers;
    randomNumbers = arr.slice(16, 17);
    return randomNumbers;
  }
  function getPullCards(arr: Array<any>, count: number) {
    let randomNumbers;
    randomNumbers = arr.splice(0, count);
    return randomNumbers;
  }
  const handlegetResult = async ({ userId, roomName, gameId }: any) => {};
  socket.on("inRoom", handleinRoom);
  socket.on("getResult", handlegetResult);
};
