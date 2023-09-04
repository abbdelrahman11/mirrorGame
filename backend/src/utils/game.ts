import { GameModel, Game } from "../models/game.model";

async function CreateGame(Game: Game) {
  return GameModel.create(Game);
}

async function getGame(id: string) {
  return GameModel.find({ _id: id });
}
async function UpdateTheGame(id: string, updatedFields: any) {
  return GameModel.findByIdAndUpdate(id, updatedFields, { new: true });
}

module.exports = {
  CreateGame,
  getGame,
  UpdateTheGame,
};
