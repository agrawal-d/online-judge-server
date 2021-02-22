import { prop, getModelForClass } from "@typegoose/typegoose";

export class UserClass {
  @prop()
  name: string;

  @prop({ index: true })
  google_id: string;

  @prop()
  email: string;

  @prop({ default: Date.now() })
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
  @prop()
  he_id: string;

  @prop()
  assignment_id: string;

  @prop()
  code: string;

  @prop({ default: false })
  evaluated: boolean;

  @prop({ default: "C" })
  language: string;

  @prop({ default: "" })
  stdin: string;

  @prop({ default: "" })
  stdout: string;

  @prop({ default: "" })
  stderr: string;

  @prop()
  signal: string;

  @prop()
  errors: unknown;

  @prop()
  time_used: number;
}

export const UserModel = getModelForClass(UserClass);
