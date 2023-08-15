import { GameModel, Game } from "../models/gamemodel.";

async function CreateGame(Game: Game) {
  return GameModel.create(Game);
}

async function getGame(id: string) {
  return GameModel.find({ _id: id });
}

module.exports = {
  CreateGame,
  getGame,
};
