import { roomUsers, roomUsersModel } from "../models/roomUsers.model";

function CreateRoom(room: roomUsers) {
  return roomUsersModel.create(room);
}

function allRooms() {
  return roomUsersModel.find({});
}

module.exports = {
  CreateRoom,
  allRooms
};
