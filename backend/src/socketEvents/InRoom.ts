module.exports = (io: any, socket: any) => {
  const { roomInfo } = require("../utils/rooms");
  const { getGame, UpdateTheGame } = require("../utils/game");
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

  function gameStarted(
    userId: any,
    roomRes: any,
    theGame: any,
    roomName: string
  ) {
    socket.join(userId);
    socket.join(roomName);
    const userIndex = roomRes[0].usersId.indexOf(userId);
    io.to(userId).emit("playerIndex", userIndex + 1);
    io.to(userId).emit("allCards", theGame);
  }

  async function HandOutTheCardsToThePlayers(
    userId: string,
    roomName: string,
    gameId: string,
    theGame: any,
    roomRes: any
  ) {
    socket.join(roomName);
    socket.join(userId);
    if (theGame.length > 0) {
      const userIndex = roomRes[0].usersId.indexOf(userId);
      await UpdateTheGame(gameId, {
        [`player${userIndex + 1}`]: getRandomNumbers(
          theGame[0].cards,
          userIndex
        ),
      });
      io.to(userId).emit("playerIndex", userIndex + 1);
      if (roomRes[0].usersId.length == 4) {
        await RoomIsComplete(theGame, gameId, roomName);
      }
    }
  }

  async function RoomIsComplete(
    theGame: any,
    gameId: string,
    roomName: string
  ) {
    getPullCards(theGame[0].cards, 16);
    const updatedFields = {
      gameStarted: true,
      pullCards: theGame[0].cards,
    };
    const theGameUpdate = await UpdateTheGame(gameId, updatedFields);
    io.to(roomName).emit("allCards", [theGameUpdate]);
  }

  function getRandomNumbers(arr: Array<any>, count: number) {
    let randomNumbers;
    randomNumbers = arr.slice(count * 4, (count + 1) * 4);
    return randomNumbers;
  }

  function getPullCards(arr: Array<any>, count: number) {
    let randomNumbers;
    randomNumbers = arr.splice(0, count);
    return randomNumbers;
  }

  socket.on("inRoom", handleinRoom);
};
