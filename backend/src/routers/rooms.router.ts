import { Router } from "express";
import asyncHandler from "express-async-handler";
import { roomModel } from "../models/roomUsers.model";
import auth from "../middlewares/auth.mid";

const router = Router();

router.use(auth);

router.get(
  "/getAllRooms",
  asyncHandler(async (req, res) => {
    const rooms = await roomModel.find().sort({ _id: -1 }).limit(10);
    res.send(rooms);
  })
);
router.post(
  "/getTheRoom",
  asyncHandler(async (req, res) => {
    let { roomName } = req.body;
    const room = await roomModel.findOne({ roomName });
    res.send(room);
  })
);
router.post(
  "/roomInfo",
  asyncHandler(async (req, res) => {
    let { roomName } = req.body;
    const rooms = await roomModel.aggregate([
      { $match: { roomName } },
      {
        $lookup: {
          from: "users",
          localField: "usersId",
          foreignField: "_id",
          as: "users_info",
        },
      },
      {
        $addFields: {
          users_info: {
            $map: {
              input: "$usersId",
              as: "userId",
              in: {
                $arrayElemAt: [
                  "$users_info",
                  {
                    $indexOfArray: ["$users_info._id", "$$userId"],
                  },
                ],
              },
            },
          },
        },
      },
    ]);
    res.send(rooms);
  })
);
export default router;
