module.exports = (io: any, socket: any) => {
  const botName = "ChatCord Bot";
  const { userJoin, getRoomUsers } = require("../utils/users");
  const { formatMessage } = require("../utils/message");
  const handleJoinRoom = ({ username, room }: any) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  };

  socket.on("joinRoom", handleJoinRoom);
};
