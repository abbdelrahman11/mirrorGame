import mongoose, { Schema, model } from "mongoose";
import { Card } from "./card.model";
export interface Game {
  _id: string;
  cards: Array<Card>;
  player1: playerCards;
  player2: playerCards;
  player3: playerCards;
  player4: playerCards;
  pullCards: Array<Card>;
  tableCards: Array<Card>;
  gameStarted: boolean;
}
export interface playerCards {
  cards: Array<Card>;
  userId: mongoose.Types.ObjectId;
}

export const GameSchema = new Schema<Game>(
  {
    cards: { type: [] },
    player1: { type: mongoose.Schema.Types.Mixed },
    player2: { type: mongoose.Schema.Types.Mixed },
    player3: { type: mongoose.Schema.Types.Mixed },
    player4: { type: mongoose.Schema.Types.Mixed },
    pullCards: { type: [] },
    tableCards: { type: [] },
    gameStarted: { type: Boolean, default: false },
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
