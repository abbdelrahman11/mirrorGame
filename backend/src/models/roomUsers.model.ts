import mongoose, { Schema, model } from "mongoose";
export interface roomUsers {
  _id?: string;
  roomName: string;
  roomPoints: string;
  usersId: string;
  gameId: string;
}

export const roomUsersSchema = new Schema<roomUsers>(
  {
    roomName: { type: String, required: true, unique: true },
    roomPoints: { type: String, required: true },
    usersId: [mongoose.Types.ObjectId],
    gameId: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

export const roomUsersModel = model<roomUsers>("roomUsers", roomUsersSchema);
