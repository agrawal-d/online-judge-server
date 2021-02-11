import express from "express";
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {
  console.log("here");
  res.json({ staus: "working" });
});

export default router;
