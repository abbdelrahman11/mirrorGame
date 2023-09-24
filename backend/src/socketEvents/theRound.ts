module.exports = (io: any, socket: any) => {
  const { UpdateTheGame, cardsSum } = require("../utils/game");
  const { create, getResult } = require("../utils/result");

  const handlefinishTheRound = async ({ gameId, playersIndex }: any) => {
    const updatedFields = {
      finishTheRound: playersIndex,
    };
    await UpdateTheGame(gameId, updatedFields);
  };
  const handlegaameFinished = async ({ gameId, roomName }: any) => {
    const sum = await cardsSum(gameId);
    // await create({ round: sum, roomName });
    const result = await getResult(roomName);
    io.to(roomName).emit("showtheResult", result);
    io.to(roomName).emit("hideThePage", true);
  };

  socket.on("finishTheRound", handlefinishTheRound);
  socket.on("roundFinished", handlegaameFinished);
};
