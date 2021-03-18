import express from "express";
import config from "../config";
import hackerearth from "../hackerearth";
import admin from "./admin";
import assignments from "./assignments";

const router = express.Router();

import authRouter, { adminOnly, authorize } from "./auth";
import users from "./users";

router.get("/", function (req, res) {
  res.json({ api: "online" });
});

router.get("/config", function (req, res) {
  res.json(config);
});

router.use("/assignments", assignments);
router.use("/users", authorize, users);
router.use("/auth", authRouter);
router.use("/admin", authorize, adminOnly, admin);
router.use("/he", hackerearth);

export default router;
