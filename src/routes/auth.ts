import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import { AuthorizedReq } from "../types";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import config from "../config";
import { createAccount, getUserById } from "../database";
import { UserClass } from "../models";
import { query } from "express-validator";
import { validate } from "../validate";

const router = express.Router();

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.json({
      errors: [
        {
          message: "You need to be logged in.",
        },
      ],
    });
  }
  next();
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const a_req = req as AuthorizedReq;
  if (!a_req.user || !a_req.user.is_admin) {
    return res.json({
      errors: [
        {
          message: "You are not authorized.",
        },
      ],
    });
  }
  next();
};

router.get("/google", query("redirect").exists(), validate, (req, res, next) => {
  const auth = passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login", "https://www.googleapis.com/auth/userinfo.email"],
    state: req.query.redirect.toString(),
  });
  auth(req, res, next);
});

router.get("/auth-failed", (req, res) => {
  res.json({
    error: {
      message: "Authentication failed",
    },
  });
});

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth-failed" }),
  async function (req: AuthorizedReq, res) {
    const redirect = req.query.state;
    if (typeof redirect === "string") {
      return res.redirect(redirect);
    }

    return res.json({
      error: {
        message: "No redirect URL in state",
      },
    });
  }
);

router.get("/logout", (req: AuthorizedReq, res) => {
  req.session.destroy((err) => console.error(err));
  return res.json({ logout: true });
});

export const configureAuth = (): void => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: new URL("api/v0/auth/google/callback", config.hostname).href,
      },
      async function (_accessToken, _refreshToken, profile, done) {
        let savedUser = await getUserById(profile.id);
        if (savedUser == undefined) {
          savedUser = await createAccount(profile);
        }
        return done(undefined, savedUser, undefined);
      }
    )
  );

  passport.serializeUser(function (user: UserClass, done) {
    done(null, user.google_id);
  });

  passport.deserializeUser(async function (id: string, done) {
    const p = await getUserById(id);
    if (!p) {
      done("User not found");
    }
    done(null, p);
  });
};

export default router;
