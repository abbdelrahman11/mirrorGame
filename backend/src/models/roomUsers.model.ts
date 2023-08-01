import { Schema, model } from "mongoose";
export interface roomUsers {
  id: string;
  roomName: string;
  roomPoints: string;
  usersId?: Array<String>;
  romMembersCount: string;
}

export const roomUsersSchema = new Schema<roomUsers>(
  {
    roomName: { type: String, required: true },
    roomPoints: { type: String, required: true },
    usersId: { type: Array<String>, required: true },
    romMembersCount: { type: String, required: true },
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
