import { Router } from "express";
import asyncHandler from "express-async-handler";
import { CardModel } from "../models/card.model";
import auth from "../middlewares/auth.mid";

const router = Router();

router.use(auth);

router.get(
  "/getAllCards",
  asyncHandler(async (req, res) => {
    const cardsCount = await CardModel.countDocuments();
    const cards = await CardModel.aggregate([
      { $sample: { size: cardsCount } },
    ]);
    res.send(cards);
  })
);

export default router;
