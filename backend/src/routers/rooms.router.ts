import { Router } from "express";
import asyncHandler from "express-async-handler";
import { roomModel } from "../models/roomUsers.model";
import auth from "../middlewares/auth.mid";

const router = Router();

router.use(auth);

router.get(
  "/getAllRooms",
  asyncHandler(async (req, res) => {
    const rooms = await roomModel.find({});
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
          pipeline: [
            {
              $sort: {
                _id: 1,
              },
            },
          ],
        },
      },
    ]);
    res.send(rooms);
  })
);
export default router;
