import { GameModel, Game } from "../models/game.model";

async function CreateGame(Game: Game) {
  return GameModel.create(Game);
}

async function getGame(id: string) {
  return GameModel.find({ _id: id });
}
async function UpdatePullCards(id: string, key: string, value: any) {
  return GameModel.findByIdAndUpdate(id, { $push: { [key]: value } });
}

async function UpdateOneKey(id: string, key: string, value: any) {
  return GameModel.findByIdAndUpdate(id, { [key]: value });
}
module.exports = {
  CreateGame,
  getGame,
  UpdatePullCards,
  UpdateOneKey,
};
