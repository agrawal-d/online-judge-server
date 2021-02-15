import express from "express";
import { query } from "express-validator";
import { UserModel } from "../models";
import { AuthorizedReq } from "../types";
const router = express.Router();

router.get("/", query("google-id").exists(), async function (req: AuthorizedReq, res) {
  const google_id = req.query.google_id as string;
  const user = await UserModel.findOne({ google_id });

  if (user) {
    return res.json(user);
  }

  return res.json({
    error: {
      message: "User not found.",
    },
  });
});

router.get("/me", async function (req: AuthorizedReq, res) {
  const google_id = req.user.google_id;
  const me = await UserModel.findOne({ google_id });
  return res.json(me);
});

export default router;
