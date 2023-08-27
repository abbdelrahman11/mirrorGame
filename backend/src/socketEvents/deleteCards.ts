module.exports = (io: any, socket: any) => {
  const { getGame, UpdateGame } = require("../utils/game");
  const handledeleteCards = async ({ gameId, cards, roomName }: any) => {
    await UpdateGame(gameId, "pullCards", cards);
    const cardsUpdate = await getGame(gameId);

    io.to(roomName).emit("allCards", cardsUpdate);
    socket.emit("cardDeleted", true);
  };

  socket.on("deleteCards", handledeleteCards);
};
