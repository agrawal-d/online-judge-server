import { Request, Response, NextFunction } from "express";
import { UserModel } from "./models";

/** Sleep for `ms` (argument) miliseconds */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Log in as a user in dev mode */
export async function devLogin(req: Request, res: Response, next: NextFunction) {
  if (req.headers["dev-user-email"]) {
    const email = req.headers["dev-user-email"] as string;
    const user = await UserModel.findOne({ email });

    if (user) {
      req.user = user;
    }
  }

  next();
}
