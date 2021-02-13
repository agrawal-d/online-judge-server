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

export const UserModel = getModelForClass(UserClass);
