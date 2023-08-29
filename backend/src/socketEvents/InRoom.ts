module.exports = (io: any, socket: any) => {
  const { roomInfo } = require("../utils/rooms");
  const { getGame, UpdateOneKey } = require("../utils/game");
  const handleinRoom = async ({ userId, roomName, gameId }: any) => {
    try {
      const roomRes = await roomInfo(roomName);
      const cards = await getGame(gameId);
      if (cards[0].gameStarted) {
        gameStarted(userId, roomRes, cards, roomName);
      } else {
        HandOutTheCardsToThePlayers(userId, roomName, gameId, cards, roomRes);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  function gameStarted(
    userId: any,
    roomRes: any,
    cards: any,
    roomName: string
  ) {
    socket.join(userId);
    socket.join(roomName);
    const userIndex = roomRes[0].usersId.indexOf(userId);
    io.to(userId).emit("playerIndex", userIndex + 1);
    io.to(userId).emit("allCards", cards);
  }

  async function HandOutTheCardsToThePlayers(
    userId: string,
    roomName: string,
    gameId: string,
    cards: any,
    roomRes: any
  ) {
    socket.join(roomName);
    socket.join(userId);
    if (cards.length > 0) {
      const userIndex = roomRes[0].usersId.indexOf(userId);
      const playerCardsres = await UpdateOneKey(
        gameId,
        `player${userIndex + 1}`,
        getRandomNumbers(cards[0].cards, userIndex)
      );
      io.to(userId).emit("playerIndex", userIndex + 1);
      if (roomRes[0].usersId.length == 4) {
        getPullCards(cards[0].cards, 16);
        await UpdateOneKey(gameId, "gameStarted", true);
        await UpdateOneKey(gameId, "pullCards", cards[0].cards);
        const cardsUpdate = await getGame(gameId);

        io.to(roomName).emit("allCards", cardsUpdate);
      }
    }
  }

  socket.on("inRoom", handleinRoom);
};
