import mongoose, { Schema, model } from "mongoose";

export interface Result {
  round: Array<any>;
  roomName: string;
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
