import { prop, getModelForClass } from "@typegoose/typegoose";

export class UserClass {
  @prop()
  name: string;

  @prop({ index: true })
  google_id: string;

  @prop()
  email: string;

  @prop({ default: Date.now })
  created: Date;

  @prop()
  picture: string;

  @prop({ default: false })
  is_ta: boolean;

  @prop({ default: false })
  is_admin: boolean;

  @prop({ default: false })
  is_instructor: boolean;

  @prop({ default: "" })
  he_client_id: string;

  @prop({ default: "" })
  he_client_secret: string;
}

export class SubmissionClass {
  @prop({ index: true })
  he_id: string;

  @prop()
  status_update_url: string;

  @prop()
  assignment_id: string;

  @prop()
  submitter_google_id: string;

  @prop({ default: Date.now })
  created: Date;

  @prop({ default: "No verdict yet" })
  verdict: string;

  @prop()
  code: string;

  @prop()
  testcase_id: string;

  @prop({ default: false })
  evaluated: boolean;

  @prop({ default: "C" })
  language: string;

  @prop({ default: "" })
  stdin: string;

  @prop({ default: "" })
  stdout: string;

  @prop()
  time_used: string;
}

export class EligibilityClass {
  @prop({ index: true })
  user_id: string;

  @prop({ index: true })
  assignment_id: string;
}

export class TestCaseClass {
  @prop({ index: true })
  id: string;

  @prop({ index: true })
  question_id: string;

  @prop()
  input: string;

  @prop()
  output: string;

  @prop()
  visible: boolean;
}

export class QuestionClass {
  @prop({ index: true })
  id: string;

  @prop({ index: true })
  assigment_id: string;

  @prop()
  name: string;

  @prop()
  time_limit: string;

  @prop()
  memory_limit: string;

  @prop()
  problem_statement: string;

  @prop()
  languages_allowed: string[];

  @prop()
  testcases: string[];
}

export class AssignmentClass {
  @prop({ index: true })
  id: string;

  @prop()
  name: string;

  @prop()
  prof_id: string;

  @prop()
  ta_ids: string[];

  @prop()
  student_ids: string[];

  @prop()
  start: Date;

  @prop()
  end: Date;

  @prop()
  question_ids: string[];
}

export const UserModel = getModelForClass(UserClass);
export const EligibilityModel = getModelForClass(EligibilityClass);
export const SubmissionModel = getModelForClass(SubmissionClass);
export const TestCaseModel = getModelForClass(TestCaseClass);
export const QuestionModel = getModelForClass(QuestionClass);
export const AssignmentModel = getModelForClass(AssignmentClass);
