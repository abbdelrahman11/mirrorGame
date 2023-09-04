module.exports = (io: any, socket: any) => {
  const { getGame, UpdateTheGame } = require("../utils/game");
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
    };
    const cardsUpdate = await UpdateTheGame(gameId, updatedFields);
    io.to(roomName).emit("allCards", [cardsUpdate]);
  };

  socket.on("playerTakesCard", handledeupdatePlayerCards);
};
