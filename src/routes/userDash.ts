import express from "express";
import { EligibilityModel } from "../models";
import { AuthorizedReq } from "../types";
const router = express.Router();

router.get("/", async function (req: AuthorizedReq, res) {
  const google_id = req.user.google_id as string;
  const ret = await EligibilityModel.find({ user_id: google_id });
  if (ret) {
    return res.json(ret);
  }
  return res.json({
    error: {
      message: "Dashboard not found",
    },
  });
});

export default router;
