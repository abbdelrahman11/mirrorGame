module.exports = (io: any, socket: any) => {
  const { UpdateTheGame } = require("../utils/game");
  const handledefromPullCardsToTable = async ({
    gameId,
    roomName,
    deleteCards,
    addCards,
    deleteKeyName,
    addKeyName,
  }: any) => {
    const updatedFields = {
      [deleteKeyName]: deleteCards,
      $push: { [addKeyName]: addCards },
    };
    const cardsUpdate = await UpdateTheGame(gameId, updatedFields);
    io.to(roomName).emit("allCards", [cardsUpdate]);
  };

  socket.on("fromPullCardsToTable", handledefromPullCardsToTable);
};
