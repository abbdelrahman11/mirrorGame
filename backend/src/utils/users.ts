import { roomUsers, roomUsersModel } from "../models/roomUsers.model";

const users: any = [];

// Join user to chat
function userJoin(user: roomUsers) {
  return roomUsersModel.create(user);
}

// Get current user
function getCurrentUser(id: number) {
  return users.find((user: any) => user.id === id);
}

// User leaves chat
function userLeave(id: number) {
  return roomUsersModel.findOneAndDelete({ user_id: id });
}

// Get room users
function getRoomUsers(room: any) {
  return roomUsersModel.find({ room });
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
