import mongoose, { Schema, model } from "mongoose";

export interface Result {
  round: Array<any>;
  roomName: string;
}
export interface Points {
  _id: null;
  totalPlayer1: number;
  totalPlayer2: number;
  totalPlayer3: number;
  totalPlayer4: number;
}

export const ResultSchema = new Schema<Result>(
  {
    round: { type: mongoose.Schema.Types.Mixed },
    roomName: { type: String },
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

export const ResultModel = model<Result>("result", ResultSchema);
