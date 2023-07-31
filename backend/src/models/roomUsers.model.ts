import { Schema, model } from "mongoose";

export interface roomUsers {
  id: string;
  user_id: string;
  username: string;
  room: string;
}

export const roomUsersSchema = new Schema<roomUsers>(
  {
    user_id: { type: String, required: true },
    username: { type: String, required: true },
    room: { type: String, required: true },
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
