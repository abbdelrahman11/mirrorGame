import { GameModel, Game } from "../models/game.model";

async function CreateGame(Game: Game) {
  return GameModel.create(Game);
}

async function getGame(id: string) {
  return GameModel.find({ _id: id });
}
async function UpdatePlayerCards(id: string, key: string, value: any) {
  return GameModel.findByIdAndUpdate(
    id,

    {
      $push: {
        [key]: {
          $each: [value],
          $slice: 4,
        },
      },
    }
  );
}

async function UpdateGame(id: string, key: string, value: any) {
  return GameModel.findByIdAndUpdate(id, { [key]: value });
}
module.exports = {
  CreateGame,
  getGame,
  UpdatePlayerCards,
  UpdateGame,
};
