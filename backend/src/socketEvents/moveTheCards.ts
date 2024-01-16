module.exports = (io: any, socket: any) => {
  const handleMoveTheCards = async ({ roomName, sourceId, targetId }: any) => {
    io.to(roomName).emit("moveTheCards", { sourceId, targetId });
  };

  socket.on("moveTheCard", handleMoveTheCards);
};
