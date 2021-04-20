/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { body, query } from "express-validator";
import { make_submission_and_evaluate } from "../hackerearth";
import { AssignmentModel, EligibilityModel, ProblemModel, SubmissionModel, TestCaseModel, UserModel } from "../models";
import { AuthorizedReq, Result } from "../types";
import { validate } from "../validate";
const router = express.Router();

router.get("/", query("assignment_id").exists(), validate, async function (req: AuthorizedReq, res) {
  try {
    const assignId = req.query.assignment_id;
    const assign = await AssignmentModel.findById(assignId);

    const full_assign: any = assign.toJSON();
    const full_problems = [];

    for (const problem_id of assign.problem_ids) {
      const prob = await ProblemModel.findById(problem_id);
      const full_problem: any = prob;
      const full_testcases = [];

      for (const testcase_id of prob.testcases) {
        const tc = await TestCaseModel.findById(testcase_id);
        full_testcases.push(tc);
      }

      full_problem.testcases = full_testcases;
      full_problems.push(full_problem);
    }

    full_assign.problems = full_problems;

    return res.json(full_assign);
  } catch (err) {
    res.json({ errors: [err] });
  }
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
      assignment_id: req.body.assignment_id,
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
  body("ta_ids").isArray({ min: 1 }),
  body("student_ids").isArray({ min: 1 }),
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

    for (let index = 0; index < req.body.student_ids.length; index++) {
      const element = req.body.student_ids[index];
      const student_elig = new EligibilityModel({
        user_id: element,
        assignment_id: assignment.id,
        is_ta: false,
      });
      student_elig.save();
    }
    for (let index = 0; index < req.body.ta_ids.length; index++) {
      const element = req.body.ta_ids[index];
      const ta_elig = new EligibilityModel({
        user_id: element,
        assignment_id: assignment.id,
        is_ta: true,
      });
      ta_elig.save();
    }

    return res.json(assignment);
  }
);

router.post(
  "/submit",
  body("assignment_id").exists(),
  body("code").exists(),
  validate,
  async (req: AuthorizedReq, res) => {
    const assign = await AssignmentModel.findById(req.body.assignment_id);

    if (!assign) {
      return res.json({ errors: ["Invalid assignment"] });
    }

    // const elibility = await EligibilityModel.findOne({
    //   user_id: req.user.google_id,
    //   assignment_id: req.body.assignment_id,
    // });
    // if (!elibility) {
    //   return res.json({ errors: ["You are not authorized to submit this assignment"] });
    // }

    res.json({ submitted: "ok" });
    let pidx = -1;
    for (const problem_id of assign.problem_ids) {
      pidx++;
      const problem = await ProblemModel.findById(problem_id);

      for (const testcase_id of problem.testcases) {
        const testcase = await TestCaseModel.findById(testcase_id);
        make_submission_and_evaluate({
          submitter_google_id: req.user.google_id,
          assignment_id: assign.id,
          testcase_id: testcase.id,
          code: req.body.code[pidx],
          input: testcase.input,
          expected_output: testcase.output,
        });
      }
    }
  }
);

router.post(
  "/add-problem",
  body("assignment_id").exists(),
  body("name").exists(),
  body("problem_statement").exists(),
  body("languages_allowed").isArray({ min: 1 }),
  body("time_limit").exists(),
  body("memory_limit").exists(),
  body("testcases").isArray({ min: 1 }),
  validate,
  async (req: AuthorizedReq, res) => {
    const problem = new ProblemModel({
      assignment_id: req.body.assignment_id,
      name: req.body.name,
      time_limit: req.body.time_limit,
      memory_limit: req.body.memory_limit,
      problem_statement: req.body.problem_statement,
      languages_allowed: req.body.languages_allowed,
      testcases: [],
    });

    const savedProblem = await problem.save();

    await AssignmentModel.findByIdAndUpdate(
      req.body.assignment_id,
      {
        $push: {
          problem_ids: savedProblem.id,
        },
      },
      undefined
    );

    for (let index = 0; index < req.body.testcases.length; index++) {
      const element = req.body.testcases[index];
      const testCase = new TestCaseModel({
        problem_id: savedProblem.id,
        input: element.input,
        output: element.output,
        visible: element.visible,
      });
      console.log(element.visible);
      const savedTest = await testCase.save();
      await ProblemModel.findByIdAndUpdate(
        savedProblem.id,
        {
          $push: {
            testcases: savedTest.id,
          },
        },
        undefined
      );
    }

    return res.end("OK");
  }
);

router.get("/report", query("assignment_id").exists(), validate, async (req: AuthorizedReq, res) => {
  const assignment_id = req.query.assignment_id as string;
  const assignment = await AssignmentModel.findById(assignment_id).lean();
  console.log(assignment_id, assignment);

  const result: Result = {
    assignment,
    submissions: [],
  };

  for (const student_email of assignment.student_ids) {
    const student = await UserModel.findOne({ email: student_email }).lean();
    if (!student) {
      continue;
    }
    const submissions = await SubmissionModel.find({ submitter_google_id: student.google_id, assignment_id }).lean();
    const sub = {
      student,
      submissions,
    };

    result.submissions.push(sub);
  }

  res.json(result);
});

export default router;
