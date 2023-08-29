import { roomUsers } from "../models/roomUsers.model";

module.exports = (io: any, socket: any, callback: any) => {
  const { CreateRoom, allRooms, checkTheRoomName } = require("../utils/rooms");
  const { CreateGame } = require("../utils/game");
  const { getAllCards } = require("../utils/cards");
  const handleCreateRoom = ({ roomName, roomPoints, usersId, gameId }: any) => {
    const room = { roomName, roomPoints, usersId, gameId };
    checkTheRoomName(room)
      .then((gameres: any) => {
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
                      .catch((error: any) => {});
                  })
                  .catch((error: any) => {});
              })
              .catch((error: any) => {});
          })
          .catch((error: any) => {});
      })

      .catch((error: any) => {
        io.emit("allRooms", { error });
      });
  };

  socket.on("createRoom", handleCreateRoom);
};
