module.exports = (io: any, socket: any) => {
  const { roomInfo } = require("../utils/rooms");
  const { getGame } = require("../utils/game");
  const handleinRoom = ({ userId, roomName, gameId }: any) => {
    roomInfo(roomName).then((roomRes: any) => {
      socket.join(roomName);
      socket.join(userId);
      return getGame(gameId).then((cards: any) => {
        let userIndex = roomRes[0].usersId.indexOf(userId);
        io.to(userId).emit(
          "playerCards",
          getRandomNumbers(cards[0].cards, userIndex)
        );
        if (roomRes[0].usersId.length == 4) {
          getPullCards(cards[0].cards, 16);
          io.to(roomName).emit("pullCards", cards[0].cards);
        }
      });
    });
  };
  function getRandomNumbers(arr: Array<any>, count: number) {
    let randomNumbers;
    randomNumbers = arr.slice(count * 4, (count + 1) * 4);

    return randomNumbers;
  }
  function getPullCards(arr: Array<any>, count: number) {
    let randomNumbers;
    randomNumbers = arr.splice(0, count);

    return randomNumbers;
  }
  socket.on("inRoom", handleinRoom);
};
