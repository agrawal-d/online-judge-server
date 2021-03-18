import express from "express";
import { body, query } from "express-validator";
import { make_submission_and_evaluate } from "../hackerearth";
import { sleep } from "../lib";
import { AssignmentModel, EligibilityModel, SubmissionModel, TestCaseModel } from "../models";
import { AuthorizedReq } from "../types";
import { validate } from "../validate";
const router = express.Router();

const ps1 = `

Vasya came to the store to buy goods for his friends for the New Year. It turned out that he was very lucky — today the offer "k of goods for the price of one" is held in store.
<br/>
Using this offer, Vasya can buy exactly k of any goods, paying only for the most expensive of them. Vasya decided to take this opportunity and buy as many goods as possible for his friends with the money he has.
<br/>
More formally, for each good, its price is determined by ai — the number of coins it costs. Initially, Vasya has p coins. He wants to buy the maximum number of goods. Vasya can perform one of the following operations as many times as necessary:

    Vasya can buy one good with the index i if he currently has enough coins (i.e p≥ai). After buying this good, the number of Vasya's coins will decrease by ai, (i.e it becomes p:=p−ai).
    Vasya can buy a good with the index i, and also choose exactly k−1 goods, the price of which does not exceed ai, if he currently has enough coins (i.e p≥ai). Thus, he buys all these k goods, and his number of coins decreases by ai (i.e it becomes p:=p−ai). 

<b><p>Please note that each good can be bought no more than once.</p></b>
<br/>
For example, if the store now has n=5 goods worth a1=2,a2=4,a3=3,a4=5,a5=7, respectively, k=2, and Vasya has 6 coins, then he can buy 3 goods. A good with the index 1 will be bought by Vasya without using the offer and he will pay 2 coins. Goods with the indices 2 and 3 Vasya will buy using the offer and he will pay 4 coins. It can be proved that Vasya can not buy more goods with six coins.
`;

router.get("/", query("assignmentId").exists(), validate, async function (req: AuthorizedReq, res) {
  console.log("HERE");
  res.json({
    id: 0,
    name: "Assignment I",
    start: new Date(0).toString(),
    end: new Date(Date.now() + 36000).toString(),
    problems: [
      {
        name: "Problem A",
        id: "1",
        statement: ps1,
        language: "C",
        testcases: [
          {
            id: "6053a4d4d3a535c76bcce0ad",
            input: "42",
            output: "42",
          },
          {
            id: "6053a4d4d3a535c76bcce0ad",
            input: "45",
            output: "45",
          },
        ],
      },
      {
        name: "Problem B",
        id: "2",
        statement: "<b>Problem Statement II</b>",
        language: "C",
        testcases: [
          {
            id: "6053a4d4d3a535c76bcce0ad",
            input: "43",
            output: "43",
          },
          {
            id: "6053a4d4d3a535c76bcce0ad",
            input: "44",
            output: "44",
          },
        ],
      },
    ],
  });
});

router.post(
  "/run-testcase",
  body("assignment_id").exists(),
  body("testcase_id").exists(),
  body("code").exists(),
  body("problem_id").exists(),
  validate,
  async (req: AuthorizedReq, res) => {
    const user_id = req.user.google_id;
    // const elibility = await EligibilityModel.findOne({ user_id, assignment_id: req.body.assigment_id });

    // if (!elibility) {
    //   return res.json({ errors: [{ message: "Unauthorized to submit to this assignment" }] });
    // }

    const testcase = await TestCaseModel.findById(req.body.testcase_id);

    const sub = await make_submission_and_evaluate({
      submitter_google_id: user_id,
      assignment_id: req.body.assigment_id,
      testcase_id: req.body.testcase_id,
      code: req.body.code,
      input: testcase.input,
      expected_output: testcase.output,
    });

    res.json(sub);
  }
);

router.post(
  "/add-assignment",
  body("ass_name").exists(),
  body("ta_ids").exists(),
  body("student_ids").exists(),
  body("start").exists(),
  body("end").exists(),
  validate,
  async (req: AuthorizedReq, res) => {
    const assign = new AssignmentModel({
      name: req.body.ass_name,
      prof_id: req.user.google_id,
      ta_ids: req.body.ta_ids,
      student_ids: req.body.student_ids,
      start: req.body.start,
      end: req.body.end,
      problem_ids: [],
    });
    const assignment = await assign.save();
    req.body.student_ids.forEach((id: string) => {
      const eli = new EligibilityModel({
        user_id: id,
        assignment_id: assignment.id,
      });
      eli.save();
    });
    return res.json(assignment);
  }
);

export default router;
