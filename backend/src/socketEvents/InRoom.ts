module.exports = (io: any, socket: any) => {
  const { roomInfo } = require("../utils/rooms");
  const { getGame } = require("../utils/game");
  const handleinRoom = ({ userId, roomName, gameId }: any) => {
    roomInfo(roomName).then((roomRes: any) => {
      socket.join(roomName);
      socket.join(userId);
      return getGame(gameId).then((cards: any) => {
        let userIndex = roomRes[0].usersId.indexOf(userId);
        io.to(roomName).emit("test", cards);

        io.to(userId).emit(
          "AllCards",
          getRandomNumbers(cards[0].cards, userIndex)
        );
      });
    });
  };
  function getRandomNumbers(arr: Array<any>, count: number) {
    let randomNumbers;
    randomNumbers = arr.slice(count * 4, (count + 1) * 4);

    return randomNumbers;
  }
  socket.on("inRoom", handleinRoom);
};
