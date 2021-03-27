import express from "express";
import axios from "axios";
import config from "./config";
const router = express.Router();
import { SubmissionModel } from "./models";
import { HE_Request_status } from "./types";
import { sleep } from "./lib";

const headers = {
  "client-secret": "8f821eabf6e2d2f302dc83921432070b30817121",
  "content-type": "application/json",
};

const callbackURL = new URL("/api/v0/he/he_callback", config.heroku_url).toString();

export async function make_submission_and_evaluate(p: {
  submitter_google_id: string;
  assignment_id: string;
  testcase_id: string;
  code: string;
  input: string;
  expected_output: string;
}) {
  await SubmissionModel.findOneAndDelete({
    submitter_google_id: p.submitter_google_id,
    assignment_id: p.assignment_id,
    testcase_id: p.testcase_id,
  });

  const context = {
    submitter_google_id: p.submitter_google_id,
    testcase_id: p.testcase_id,
    assignment_id: p.assignment_id,
  };

  const sentData = {
    lang: "C",
    memory_limit: 2463232,
    time_limit: 5,
    callback: callbackURL,
    source: p.code,
    input: p.input,
    context: JSON.stringify(context),
  };

  const dataString = JSON.stringify(sentData);

  const options = {
    url: "https://api.hackerearth.com/v4/partner/code-evaluation/submissions/",
    method: "POST",
    headers: headers,
    body: dataString,
  };

  const res = await axios.post(options.url, options.body, {
    headers: options.headers,
  });

  const data = res.data;
  const body: { he_id: string; status_update_url: string } = data;

  const sub = new SubmissionModel({
    he_id: body.he_id,
    status_update_url: body.status_update_url,
    assignment_id: p.assignment_id,
    submitter_google_id: p.submitter_google_id,
    code: p.code,
    stdin: p.input,
    testcase_id: p.testcase_id,
    evaluated: false,
    language: "C",
  });
  sub.save();
  await sleep(6000);
  const evaluated_sub = await evaluate_submission(body.he_id, p.expected_output);
  console.log(evaluated_sub);
  return evaluated_sub;
}
export async function evaluate_submission(he_id: string, expected_output: string) {
  console.log("Evaluating", he_id);
  const sub = await SubmissionModel.findOne({ he_id });
  const url = sub.status_update_url;
  const res = await axios.get(url, { headers });
  const data: HE_Request_status = res.data;

  if (data.result.compile_status !== "OK") {
    sub.verdict = "Unable to compile";
    sub.evaluated = true;
    return sub.save();
  }

  sub.evaluated = true;
  // console.warn(data.result.run_status.output);
  const output_text_res = await axios.get(data.result.run_status.output);
  // console.warn(output_text_res);
  sub.stdout = output_text_res.data.toString().trim();
  const pass = sub.stdout.trim() === expected_output.trim();
  sub.verdict = pass ? "PASS" : "FAIL";
  sub.time_used = data.result.run_status.time_used;

  return sub.save();
}

router.post("/he_callback", async function (req, res) {
  console.log("HE CALLBACK ( Unused )");
  res.end();
});

export default router;
