module.exports = (io: any, socket: any) => {
  const { UpdateTheGame } = require("../utils/game");
  const handledeupdatePlayerCards = async ({
    gameId,
    roomName,
    playercards,
    playerkeyName,
    PullCards,
    tableCards,
    PullCardsKeyName,
    tableCardsKeyName,
  }: any) => {
    const updatedFields = {
      [playerkeyName]: playercards,
      [PullCardsKeyName]: PullCards,
      $push: { [tableCardsKeyName]: tableCards },
      $inc: { activeUserIndex: 1 },
    };
    const cardsUpdate = await UpdateTheGame(gameId, updatedFields);
    io.to(roomName).emit("allCards", [cardsUpdate]);
  };
  const handlechandeshowTwoCardsValue = async ({
    gameId,
    value,
    playersIndex,
  }: any) => {
    if (playersIndex == 1) {
      const updatedFields = {
        showTwoCards: value,
      };
      await UpdateTheGame(gameId, updatedFields);
    }
  };
  socket.on("playerTakesCard", handledeupdatePlayerCards);
  socket.on("chandeshowTwoCardsValue", handlechandeshowTwoCardsValue);
};
