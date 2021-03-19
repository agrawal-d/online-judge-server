import express from "express";
import { body } from "express-validator";
import { UserModel, EligibilityModel, AssignmentModel } from "../models";
import { AuthorizedReq } from "../types";
import { validate } from "../validate";
const router = express.Router();

router.get("/", async function (req: AuthorizedReq, res) {
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

router.get("/instructors", async function (req: AuthorizedReq, res) {
  const users = await UserModel.find({ is_instructor: true });
  return res.json(users);
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
  validate,
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

router.get("/get-my-assignments", async function (req: AuthorizedReq, res) {
  const google_email = req.user.email as string;
  const temp = await EligibilityModel.find({ user_id: google_email });
  let assignments: any[] = [];

  let pro = new Promise<void>((resolve, reject) => {
    temp.forEach(async (element, index, array) => {
      const deets = await AssignmentModel.find({ _id: element.assignment_id });
      const to_ret = deets.map((item) => [item.id, item.name, item.start, item.end, element.is_ta]);
      assignments.push(to_ret);
      if (index === array.length - 1) {
        resolve();
      }
    });
  });
  pro.then(() => {
    console.log(assignments);

    return res.json(assignments);
  });
});

router.get("/get-prof-assigments", async function (req: AuthorizedReq, res) {
  const google_id = req.user.google_id as string;
  const ass_of_profs = await AssignmentModel.find({ prof_id: google_id });
  return res.json(ass_of_profs);
});

export default router;
