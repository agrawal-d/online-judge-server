import { Request } from "express";
import { UserClass } from "./models";

export interface AuthorizedReq extends Request {
  user: UserClass;
}
