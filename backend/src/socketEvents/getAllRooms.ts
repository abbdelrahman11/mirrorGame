module.exports = (io: any, socket: any) => {
  const { allRooms } = require("../utils/rooms");

  const handlegetallRooms = () => {
    console.log(":inf");
    allRooms()
      .then((res: any) => {
        socket.emit("getallRoomsRes", res);
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  socket.on("getallRooms", handlegetallRooms);
};