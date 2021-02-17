import express from "express";
const router = express.Router();

import authRouter, { authorize } from "./auth";
import users from "./users";

router.get("/", function (req, res) {
  res.json({ api: "online" });
});
router.use("/users", authorize, users);
router.use("/auth", authRouter);

export default router;
