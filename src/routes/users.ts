import express from "express";
import { body, query } from "express-validator";
import { UserModel } from "../models";
import { AuthorizedReq } from "../types";
const router = express.Router();

router.get("/", query("google-id").exists(), async function (req: AuthorizedReq, res) {
  if (!req.query.google_id) {
    return res.json(await UserModel.find());
  }

  const google_id = req.query.google_id as string;
  const user = await UserModel.findOne({ google_id });

  if (user) {
    return res.json(user);
  }

  return res.json({
    error: {
      message: "User not found.",
    },
  });
});

router.get("/me", async function (req: AuthorizedReq, res) {
  const google_id = req.user.google_id;
  const me = await UserModel.findOne({ google_id });
  return res.json(me);
});

router.post(
  "/me/update-he",
  body("he_client_secret").exists(),
  body("he_client_id").exists(),
  (req: AuthorizedReq, res) => {
    const google_id = req.user.google_id;
    const query = { google_id };
    UserModel.findOneAndUpdate(
      query,
      {
        $set: {
          he_client_id: req.body.he_client_id,
          he_client_secret: req.body.he_client_secret,
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
  }
);

export default router;
