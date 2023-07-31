import { Schema, model } from "mongoose";

export interface messages {
  id?: string;
  username: string;
  text: string;
}

export const messagesSchema = new Schema<messages>(
  {
    username: { type: String, required: true },
    text: { type: String, required: true },
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

export const messagesModel = model<messages>("messages", messagesSchema);
