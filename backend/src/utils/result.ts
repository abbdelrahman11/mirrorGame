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
module.exports = {
  create,
  getResult,
};
