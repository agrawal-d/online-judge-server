import express from "express";
import { make_submission_and_evaluate } from "../hackerearth";
const router = express.Router();

router.get("/", function (req, res) {
  res.json({ staus: "working" });
});

router.get("/test", async function (req, res) {
  make_submission_and_evaluate({
    submitter_google_id: "gid",
    assignment_id: "aid",
    testcase_id: "tid",
    code: '#include<stdiox.h>\nint main(){printf("hello world");}',
    input: "inp",
    expected_output: "hello world",
  });

  res.end("OK");
});

router.get("/redirect", function (req, res) {
  res.redirect("http://bits-judge-server.herokuapp.com/redirect1");
});

router.get("/redirect1", function (req, res) {
  res.redirect("http://bits-judge-server.herokuapp.com/final");
});
export default router;
