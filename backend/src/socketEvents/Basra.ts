module.exports = (io: any, socket: any) => {
  const { UpdateTheGame } = require("../utils/game");

  const handleBasra = async ({
    gameId,
    roomName,
    playerCards,
    playerkeyName,
    TableCards,
    tableCardsKeyName,
    pullCardsKeyName,
    pullCards,
  }: any) => {
    const updatedFields = {
      [playerkeyName]: playerCards,
      [tableCardsKeyName]: TableCards,
      [pullCardsKeyName]: pullCards,
      $inc: { activeUserIndex: 1 },
    };
    const cardsUpdate = await UpdateTheGame(gameId, updatedFields);
    io.to(roomName).emit("allCards", [cardsUpdate]);
  };

  socket.on("Basra", handleBasra);
};
