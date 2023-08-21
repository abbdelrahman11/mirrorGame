import mongoose, { Schema, model } from "mongoose";
import { Card } from "./card.model";
export interface Game {
  _id: string;
  cards: Array<Card>;
  playerCards: Array<playerCards>;
  pullCards: Array<Card>;
  tableCards: Array<Card>;
}
export interface playerCards {
  cards: Array<Card>;
  userId: mongoose.Types.ObjectId;
}

export const GameSchema = new Schema<Game>(
  {
    cards: { type: [] },
    playerCards: { type: [] },
    pullCards: { type: [] },
    tableCards: { type: [] },
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
