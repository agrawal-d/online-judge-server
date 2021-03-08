import express from "express";
import { body } from "express-validator";
import { DashboardModel } from "../models";
import { UserModel } from "../models";
import { AuthorizedReq } from "../types";
import { validate } from "../validate";
const router = express.Router();

router.get("/", async function (req: AuthorizedReq, res) {
  const google_id = req.query.google_id as string;
  const user = await UserModel.findOne({ google_id });

  if (user) {
    const ret = await DashboardModel.find({ user_id: google_id });
    return ret;
  }

  return res.json({
    error: {
      message: "Error",
    },
  });
});

export default router;
