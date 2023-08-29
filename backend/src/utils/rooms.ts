import { resolve } from "path";
import { roomUsers, roomUsersModel } from "../models/roomUsers.model";

async function CreateRoom(room: roomUsers) {
  return roomUsersModel.create(room);
}
async function checkTheRoomName(room: roomUsers) {
  const rooms = await roomUsersModel.findOne({ roomName: room.roomName });
  if (rooms) {
    return new Promise((resolve, reject) => {
      reject("This name already exists. Enter another name");
    });
  } else {
    resolve();
  }
}

function allRooms() {
  return roomUsersModel.find({});
}

function userJoin(room: roomUsers) {
  return roomUsersModel.findByIdAndUpdate(room._id, { usersId: room.usersId });
}

function roomInfo(roomName: string) {
  return roomUsersModel.find({ roomName: roomName });
}
module.exports = {
  CreateRoom,
  allRooms,
  userJoin,
  roomInfo,
  checkTheRoomName,
};
