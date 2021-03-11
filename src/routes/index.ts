import express from "express";
const router = express.Router();

router.get("/", function (req, res) {
  res.json({ staus: "working" });
});

router.get("/test", function (req, res) {
  res.end("OK");
});

export default router;
