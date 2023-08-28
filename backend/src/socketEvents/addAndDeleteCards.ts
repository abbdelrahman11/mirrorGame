module.exports = (io: any, socket: any) => {
  const { getGame, UpdateGame, UpdateTheGame } = require("../utils/game");
  const handledeleteCards = async ({
    gameId,
    cards,
    roomName,
    keyName,
  }: any) => {
    await UpdateGame(gameId, keyName, cards);
    // const cardsUpdate = await getGame(gameId);
    // io.to(roomName).emit("allCards", cardsUpdate);
    // socket.emit("cardDeleted", true);
  };

  const handledeaddCard = async ({ gameId, card, roomName, keyName }: any) => {
    await UpdateTheGame(gameId, keyName, card);
    const cardsUpdate = await getGame(gameId);
    io.to(roomName).emit("allCards", cardsUpdate);
    socket.emit("cardAded", true);
  };

  socket.on("deleteCards", handledeleteCards);
  socket.on("addCard", handledeaddCard);
};
