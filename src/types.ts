import { Request } from "express";
import { AssignmentClass, SubmissionClass, UserClass } from "./models";

export interface AuthorizedReq extends Request {
  user: UserClass;
}

export type HE_Request_status = {
  he_id: string;
  status_update_url: string;
  context: string;
  result: {
    run_status: {
      status: string;
      time_used: string;
      exit_code: string;
      stderr: string;
      status_detail: string;
      output: string;
      request_OK: string;
    };
    compile_status: string;
  };
};

export type Result = {
  assignment: AssignmentClass;
  submissions: {
    student: UserClass;
    submissions: SubmissionClass[];
  }[];
};
