module.exports = (io: any, socket: any) => {
  const { roomInfo } = require("../utils/rooms");
  const { getGame, UpdateGame, UpdatePlayerCards } = require("../utils/game");
  const handleinRoom = async ({ userId, roomName, gameId }: any) => {
    try {
      const roomRes = await roomInfo(roomName);
      socket.join(roomName);
      socket.join(userId);

      const cards = await getGame(gameId);
      if (cards.length > 0) {
        const userIndex = roomRes[0].usersId.indexOf(userId);
        const playerCardsres = await UpdatePlayerCards(gameId, "playerCards", [
          userId,
          getRandomNumbers(cards[0].cards, userIndex),
        ]);

        io.to(userId).emit("playerCards", userIndex);

        if (roomRes[0].usersId.length == 4) {
          getPullCards(cards[0].cards, 16);
          const res = await UpdateGame(gameId, "pullCards", cards[0].cards);
          const cardsUpdate = await getGame(gameId);

          io.to(roomName).emit("allCarsd", cardsUpdate);
        }
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
  socket.on("inRoom", handleinRoom);
};
