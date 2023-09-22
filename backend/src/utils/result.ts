import { Result, ResultModel } from "../models/results";

function create(result: Result) {
  return ResultModel.create(result);
}
function getResult(roomName: string) {
  return ResultModel.aggregate([
    {
      $match: { roomName },
    },
    // {
    //   $project: {
    //     totalPlayers: {
    //       $sum: [
    //         "$round.player1",
    //         "$round.player2",
    //         "$round.player3",
    //         "$round.player4",
    //       ],
    //     },
    //   },
    // },

    // {
    //   $project: {
    //     player1: { $sum: "$player1.valueNumber" },
    //     player2: { $sum: "$player2.valueNumber" },
    //     player3: { $sum: "$player3.valueNumber" },
    //     player4: { $sum: "$player4.valueNumber" }
    //   }
    // }
  ]);
}
module.exports = {
  create,
  getResult,
};
