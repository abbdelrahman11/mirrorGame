import mongoose, { Schema, model } from "mongoose";
export interface Game {
  _id: string;
  cards: Array<any>;
}

export const GameSchema = new Schema<Game>(
  {
    cards: { type: [] },
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

export const GameModel = model<Game>("game", GameSchema);
