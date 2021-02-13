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
    return res.status(403).json({
      error: {
        message: "You need to be logged in.",
      },
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
  res.status(500).json({
    error: {
      message: "Authentication failed",
    },
  });
});

router.get("/user", (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(403).json({
      error: {
        message: "No user in session.",
      },
    });
  }
});

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth-failed" }),
  async function (req: AuthorizedReq, res) {
    const redirect = req.query.state;
    console.log(req.query);
    if (typeof redirect === "string") {
      return res.redirect(redirect);
    }

    return res.status(500).json({
      error: {
        message: "No redirect URL in state",
      },
    });
  }
);

export const configureAuth = (): void => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: new URL("auth/google/callback", config.hostname).href,
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
