import { Router } from "express";
import asyncHandler from "express-async-handler";
import auth from "../middlewares/auth.mid";
import { messagesModel } from "../models/messages.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";

const router = Router();

router.use(auth);

router.post(
  "/sendProblem",
  asyncHandler(async (req, res) => {
    console.log(req.body);
    let theProblem = await messagesModel.create(req.body);
    if (theProblem) {
      res.send(true);
    } else {
      res.status(HTTP_BAD_REQUEST).send("something went wrong try later");
    }
  })
);

export default router;
