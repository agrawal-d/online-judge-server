import express from "express";
import admin from "./admin";
const router = express.Router();

import authRouter, { adminOnly, authorize } from "./auth";
import users from "./users";
import userDash from "./userDash";

router.get("/", function (req, res) {
  res.json({ api: "online" });
});
router.use("/users", authorize, users);
router.use("/auth", authRouter);
router.use("/admin", authorize, adminOnly, admin);
router.use("/userDash", authorize, userDash);

export default router;
