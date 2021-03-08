import express from "express";
import { EligibilityModel } from "../models";
import { UserModel } from "../models";
import { AuthorizedReq } from "../types";
const router = express.Router();

router.get("/", async function (req: AuthorizedReq, res) {
  const google_id = req.query.google_id as string;
  const user = await UserModel.findOne({ google_id });

  if (user) {
    const ret = await EligibilityModel.find({ user_id: google_id });
    if (ret) {
      return res.json(ret);
    }
    return res.json({
      error: {
        message: "Dashboard not found",
      },
    });
  }

  return res.json({
    error: {
      message: "User not found F",
      // type: "IDK",
    },
  });
});

export default router;
