import { Router } from "express";
import asyncHandler from "express-async-handler";
import { roomUsersModel } from "../models/roomUsers.model";
const router = Router();
router.get(
  "/getAllRooms",
  asyncHandler(async (req, res) => {
    const rooms = await roomUsersModel.find({});
    res.send(rooms);
  })
);
export default router;
