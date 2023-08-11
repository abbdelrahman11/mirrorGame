import { Schema, model } from "mongoose";

export interface Card {
  content: string;
  type: string;
  valueNumber: number;
  changed: boolean;
  imageUrl: string;
}

export const CardSchema = new Schema<Card>(
  {
    content: { type: String, required: true },
    type: { type: String, required: true },
    valueNumber: { type: Number, required: true },
    changed: { type: Boolean, default: false },
    imageUrl: { type: String, required: true },
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

export const CardModel = model<Card>("card", CardSchema);
