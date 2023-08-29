module.exports = (io: any, socket: any) => {
  const { getGame, UpdateOneKey, UpdatePullCards } = require("../utils/game");
  const handledeaddAndDeleteCards = async ({
    gameId,
    roomName,
    deleteCards,
    addCards,
    deleteKeyName,
    addKeyName,
  }: any) => {
    await UpdateOneKey(gameId, deleteKeyName, deleteCards);
    await UpdatePullCards(gameId, addKeyName, addCards);
    const cardsUpdate = await getGame(gameId);
    io.to(roomName).emit("allCards", cardsUpdate);
  };

  const handledeupdatePlayerCards = async ({
    gameId,
    roomName,
    cards,
    keyName,
  }: any) => {
    await UpdateOneKey(gameId, keyName, cards);
    const cardsUpdate = await getGame(gameId);
    io.to(roomName).emit("allCards", cardsUpdate);
  };

  socket.on("addAndDeleteCards", handledeaddAndDeleteCards);
  socket.on("updatePlayerCards", handledeupdatePlayerCards);
};
