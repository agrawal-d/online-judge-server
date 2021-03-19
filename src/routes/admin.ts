import express from "express";
import { body } from "express-validator";
import { UserModel } from "../models";
import { AuthorizedReq } from "../types";
import { validate } from "../validate";
const router = express.Router();

router.post("/make-instructor", body("email").isEmail(), validate, async function (req: AuthorizedReq, res) {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return res.json({
      errors: [{ message: `User with email ${req.body.email} does not exist` }],
    });
  }

  UserModel.findOneAndUpdate(
    { email: req.body.email },
    {
      $set: {
        is_instructor: true,
        is_ta: false,
      },
    },
    undefined,
    (err, doc) => {
      if (err) {
        return res.json({ errors: [err] });
      }
      return res.json(doc);
    }
  );
});

router.post("/make-ta", body("email").isEmail(), validate, async function (req: AuthorizedReq, res) {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return res.json({
      errors: [{ message: `User with email ${req.body.email} does not exist` }],
    });
  }

  UserModel.findOneAndUpdate(
    { email: req.body.email },
    {
      $set: {
        is_ta: true,
      },
    },
    undefined,
    (err, doc) => {
      if (err) {
        return res.json({ errors: [err] });
      }
      return res.json(doc);
    }
  );
});

export default router;
