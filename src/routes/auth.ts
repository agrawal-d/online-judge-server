import express from "express";
import passport from "passport";
import { AuthorizedReq } from "../types";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import config from "../config";

const router = express.Router();

router.post("/login", passport.authenticate("local"), function (req: AuthorizedReq, res) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  // res.redirect("/users/" + req.user.username);
  console.log(req.body.username);
  res.json(req);
});

router.get("/google", passport.authenticate("google", { scope: ["https://www.googleapis.com/auth/plus.login"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth-failed" }),
  function (req, res) {
    res.json(req.user);
  }
);

const saved: {
  id: string;
} = undefined;

export const configureAuth = (): void => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: new URL("auth/google/callback", config.hostname).href,
      },
      function (accessToken, refreshToken, profile, done) {
        console.log("Profile", profile);
        return done(undefined, profile, undefined);
      }
    )
  );

  passport.serializeUser(function (user: typeof saved, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    // User.findById(id, function (err, user) {
    //   done(err, user);
    // });
    if (saved.id !== id) {
      done(true, null);
    } else {
      done(null, saved);
    }
  });
};

export default router;
