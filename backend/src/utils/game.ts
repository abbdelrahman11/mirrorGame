import { GameModel, Game } from "../models/game.model";
const { ObjectId } = require("mongodb");

async function CreateGame(Game: Game) {
  return GameModel.create(Game);
}
async function deleteTheGame(id: string) {
  return GameModel.findByIdAndDelete(id);
}
async function getGame(id: string) {
  return GameModel.find({ _id: id });
}
async function UpdateTheGame(id: string, updatedFields: any) {
  return GameModel.findByIdAndUpdate(id, updatedFields, { new: true });
}

async function cardsSum(id: string) {
  return GameModel.aggregate([
    {
      $match: {
        _id: ObjectId(id),
      },
    },
    {
      $project: {
        player1: { $sum: "$player1.valueNumber" },
        player2: { $sum: "$player2.valueNumber" },
        player3: { $sum: "$player3.valueNumber" },
        player4: { $sum: "$player4.valueNumber" },
      },
    },
  ]);
}
module.exports = {
  CreateGame,
  getGame,
  UpdateTheGame,
  cardsSum,
  deleteTheGame,
};
