import { resolve } from "path";
import { room, roomModel } from "../models/roomUsers.model";

async function CreateRoom(room: room) {
  return roomModel.create(room);
}
async function deleteTheRoom(roomName: string) {
  return roomModel.findOneAndDelete({ roomName });
}
async function checkTheRoomName(room: room) {
  const rooms = await roomModel.findOne({ roomName: room.roomName });
  if (rooms) {
    return new Promise((resolve, reject) => {
      reject("This name already exists. Enter another name");
    });
  } else {
    resolve();
  }
}

function allRooms() {
  return roomModel.find({});
}

function userJoin(room: room) {
  return roomModel.findByIdAndUpdate(room._id, { usersId: room.usersId });
}

function roomInfo(roomName: string) {
  return roomModel.find({ roomName: roomName });
}
module.exports = {
  CreateRoom,
  allRooms,
  userJoin,
  roomInfo,
  checkTheRoomName,
  deleteTheRoom,
};
