import { Result, ResultModel } from "../models/results";

function create(result: Result) {
  return ResultModel.create(result);
}
function getResult(roomName: string) {
  return ResultModel.aggregate([
    {
      $match: { roomName },
    },
  ]);
}
function getSumOfResult(roomName: string) {
  return ResultModel.aggregate([
    {
      $match: { roomName },
    },
    {
      $group: {
        _id: null,
        totalPlayer1: { $sum: "$round.player1" },
        totalPlayer2: { $sum: "$round.player2" },
        totalPlayer3: { $sum: "$round.player3" },
        totalPlayer4: { $sum: "$round.player4" },
      },
    },
  ]);
}
module.exports = {
  create,
  getResult,
  getSumOfResult,
};
