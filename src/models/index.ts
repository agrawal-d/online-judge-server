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

export const UserModel = getModelForClass(UserClass);
export const EligibilityModel = getModelForClass(EligibilityClass);
export const SubmissionModel = getModelForClass(SubmissionClass);
