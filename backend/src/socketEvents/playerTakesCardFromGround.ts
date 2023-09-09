module.exports = (io: any, socket: any) => {
  const { UpdateTheGame } = require("../utils/game");

  const handleplayerTakesCardFromGround = async ({
    gameId,
    roomName,
    playercards,
    playerkeyName,
    tableCards,
    tableCardsKeyName,
  }: any) => {
    const updatedFields = {
      [playerkeyName]: playercards,
      [tableCardsKeyName]: tableCards,
      $inc: { activeUserIndex: 1 },
    };
    const cardsUpdate = await UpdateTheGame(gameId, updatedFields);
    io.to(roomName).emit("allCards", [cardsUpdate]);
  };

  socket.on("playerTakesCardFromGround", handleplayerTakesCardFromGround);
};
