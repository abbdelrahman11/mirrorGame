module.exports = (io: any, socket: any) => {
  const { getCurrentUser } = require("../utils/users");
  const { formatMessage } = require("../utils/message");
  const handlechatMessage = (msg: any) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  };

  socket.on("chatMessage", handlechatMessage);
};
