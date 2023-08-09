module.exports = (io: any, socket: any, callback: any) => {
  const { CreateRoom, allRooms } = require("../utils/rooms");

  const handleCreateRoom = ({ roomName, roomPoints, usersId }: any) => {
    const room = { roomName, roomPoints, usersId };

    CreateRoom(room)
      .then((Roomres: any) => {
        return allRooms()
          .then((res: any) => {
            io.emit("allRooms", res);
            socket.emit("canRoute", {});
          })
          .catch((error: any) => {
            console.error("Error in allRooms():", error);
          });
      })
      .catch((error: any) => {
        io.emit("allRooms", { error });
      });
  };

  socket.on("createRoom", handleCreateRoom);
};
