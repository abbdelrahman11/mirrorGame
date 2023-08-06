import { roomUsers, roomUsersModel } from "../models/roomUsers.model";

function CreateRoom(room: roomUsers) {
  return roomUsersModel.create(room);
}

function allRooms() {
  return roomUsersModel.find({});
}

function userJoin(room: roomUsers) {
  return roomUsersModel.findByIdAndUpdate(room._id, { usersId: room.usersId });
}

module.exports = {
  CreateRoom,
  allRooms,
  userJoin
};
