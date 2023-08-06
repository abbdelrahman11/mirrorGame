module.exports = (io: any, socket: any, callback: any) => {
  const { CreateRoom, allRooms } = require("../utils/rooms");

  const handleCreateRoom = ({
    roomName,
    roomPoints,
    usersId,
   }: any) => {
    const room = { roomName, roomPoints, usersId };

    CreateRoom(room)
      .then((Roomres: any) => {
        return allRooms();
      })
      .then((res: any) => {
        io.emit("allRooms", res);
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  socket.on("createRoom", handleCreateRoom);
};
