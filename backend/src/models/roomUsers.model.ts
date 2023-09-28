import mongoose, { Schema, model } from "mongoose";
export interface room {
  _id?: string;
  roomName: string;
  roomPoints: number;
  usersId: string;
  gameId: string;
}

export const roomSchema = new Schema<room>(
  {
    roomName: { type: String, required: true, unique: true },
    roomPoints: { type: Number, required: true },
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

export const roomModel = model<room>("room", roomSchema);
