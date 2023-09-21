module.exports = (io: any, socket: any) => {
  const { UpdateTheGame } = require("../utils/game");

  const handleTakeAndGive = async ({
    gameId,
    roomName,
    mainplayerkeyName,
    mainplayerCards,
    secondplayerkeyName,
    secondplayerCards,
    TableCards,
    tableCardsKeyName,
    pullCardsKeyName,
    pullCards,
  }: any) => {
    const updatedFields = {
      [mainplayerkeyName]: mainplayerCards,
      [secondplayerkeyName]: secondplayerCards,
      [tableCardsKeyName]: TableCards,
      [pullCardsKeyName]: pullCards,
      $inc: { activeUserIndex: 1 },
    };
    const cardsUpdate = await UpdateTheGame(gameId, updatedFields);
    io.to(roomName).emit("allCards", [cardsUpdate]);
  };

  socket.on("TakeAndGive", handleTakeAndGive);
};
