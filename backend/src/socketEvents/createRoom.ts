import { roomUsers } from "../models/roomUsers.model";

module.exports = (io: any, socket: any, callback: any) => {
  const { CreateRoom, allRooms } = require("../utils/rooms");
  const { CreateGame } = require("../utils/game");
  const { getAllCards } = require("../utils/cards");
  const handleCreateRoom = ({ roomName, roomPoints, usersId, gameId }: any) => {
    const room = { roomName, roomPoints, usersId, gameId };

    getAllCards()
      .then((gameres: any) => {
        return CreateGame({ cards: gameres })
          .then((gameres: any) => {
            room.gameId = gameres._id;
            return CreateRoom(room)
              .then((Roomres: any) => {
                return allRooms()
                  .then((res: any) => {
                    io.emit("allRooms", res);
                    socket.emit("canRoute", gameres._id);
                    return;
                  })
                  .catch((error: any) => {
                    console.error("Error in allRooms", error);
                    io.emit("allRooms", { error });
                  });
              })
              .catch((error: any) => {});
          })
          .catch((error: any) => {
            console.error("Error in allRooms", error);
          });
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  socket.on("createRoom", handleCreateRoom);
};
