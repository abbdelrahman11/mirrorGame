module.exports = (io: any, socket: any) => {
  const handleMoveTheCards = async ({ roomName, sourceId, targetId }: any) => {
    io.to(roomName).emit("moveTheCards", { sourceId, targetId });
  };
  const flipTheCard = async ({ roomName, cardId }: any) => {
    io.to(roomName).emit("flipTheCards", cardId);
  };
  socket.on("moveTheCard", handleMoveTheCards);
  socket.on("flipTheCard", flipTheCard);
};
