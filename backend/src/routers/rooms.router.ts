import { Router } from "express";
import asyncHandler from "express-async-handler";
import { roomUsersModel } from "../models/roomUsers.model";
import auth from "../middlewares/auth.mid";

const router = Router();

router.use(auth);

router.get(
  "/getAllRooms",
  asyncHandler(async (req, res) => {
    const rooms = await roomUsersModel.find({});
    res.send(rooms);
  })
);
router.post(
  "/roomInfo",
  asyncHandler(async (req, res) => {
    let { roomName } = req.body;
    const rooms = await roomUsersModel.aggregate([
      { $match: { roomName } },
      {
        $lookup: {
          from: "users",
          localField: "usersId",
          foreignField: "_id",
          as: "users_info",
        },
      },
    ]);
    res.send(rooms);
  })
);
export default router;
