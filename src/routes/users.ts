import express from "express";
import { authorize } from "./auth";
const router = express.Router();

/* GET users listing. */
router.get("/restricted", authorize, function (req, res) {
  res.send("some restricted resource");
});

export default router;
