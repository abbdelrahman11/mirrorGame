module.exports = (io: any, socket: any) => {
  const botName = "ChatCord Bot";
  const { formatMessage } = require("../utils/message");
  const { getRoomUsers, userLeave } = require("../utils/users");
  const handledisconnect = () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  };

  socket.on("disconnect", handledisconnect);
};
