import { messages } from "../models/messages.model";
import { roomUsers } from "../models/roomUsers.model";

module.exports = (io: any, socket: any) => {
  const botName = "ChatCord Bot";
  const { formatMessage } = require("../utils/message");
  const { getRoomUsers, userLeave } = require("../utils/users");
  const handledisconnect = () => {
    userLeave("1").then((Leaveres: any) => {
      console.log(Leaveres);

      if (Leaveres) {
        const msgToAll: messages = {
          username: "ChatCord Bot",
          text: `${Leaveres.username} has left the chat`,
        };
        formatMessage(msgToAll).then((res: messages) => {
          io.to(Leaveres.room).emit("message", res);
        });

        // Send users and room info

        getRoomUsers(Leaveres.room).then((res: any) => {
          io.to(Leaveres.room).emit("roomUsers", {
            room: Leaveres.room,
            users: res,
          });
        });
      }
    });
  };

  socket.on("disconnect", handledisconnect);
};
