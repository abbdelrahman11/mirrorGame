import { roomUsers, roomUsersModel } from "../models/roomUsers.model";

const users: any = [];

// Get current user
function getCurrentUser(id: number) {
  return users.find((user: any) => user.id === id);
}

// User leaves chat
function userLeave(id: number) {
  return roomUsersModel.findOneAndDelete({ user_id: id });
}

// Get room users
function getRoomUsers(roomName: any) {
  return roomUsersModel.aggregate([
    { $match: { roomName } },
    {
      $lookup: {
        from: "users",
        localField: "usersId",
        foreignField: "_id",
        as: "users_info",
      },
    },
  ]);
}

module.exports = {
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
