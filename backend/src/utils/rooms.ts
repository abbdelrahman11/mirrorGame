import { roomUsers, roomUsersModel } from "../models/roomUsers.model";

async function CreateRoom(room: roomUsers) {
  const rooms = await roomUsersModel.findOne({ roomName: room.roomName });
  if (rooms) {
    return new Promise((resolve, reject) => {
      reject("This name already exists. Enter another name");
    });
  } else {
    return roomUsersModel.create(room);
  }
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
  userJoin,
};
