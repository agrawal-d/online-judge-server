import express from "express";
const router = express.Router();

router.get("/", function (req, res) {
  res.json({ staus: "working" });
});

router.get("/redirect", function (req, res) {
  res.redirect("http://bits-judge-server.herokuapp.com/redirect1");
});

router.get("/redirect1", function (req, res) {
  res.redirect("http://bits-judge-server.herokuapp.com/final");
});

router.get("/final", function (req, res) {
  res.send("<p>OK</p>");
});

export default router;
