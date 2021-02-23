import express from "express";
const router = express.Router();

router.get("/", function (req, res) {
  res.json({ staus: "working" });
});

router.get("/redirect", function (req, res) {
  res.redirect("/redirect1");
});

router.get("/redirect1", function (req, res) {
  res.redirect("/final");
});

router.get("/final", function (req, res) {
  res.end("<h1>OK</h1>");
});

export default router;
