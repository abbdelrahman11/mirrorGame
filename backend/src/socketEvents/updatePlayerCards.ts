module.exports = (io: any, socket: any) => {
  const { UpdateTheGame } = require("../utils/game");

  const handleupdatePlayerCards = async ({
    gameId,
    playerCards,
    TableCards,
    playerkeyName,
    tableCardsKeyName,
    roomName,
  }: any) => {
    const updatedFields = {
      [playerkeyName]: playerCards,
      [tableCardsKeyName]: TableCards,
      $inc: { activeUserIndex: 1 },
    };
    const cardsUpdate = await UpdateTheGame(gameId, updatedFields);
    io.to(roomName).emit("allCards", [cardsUpdate]);
  };

  socket.on("updatePlayerCards", handleupdatePlayerCards);
};
