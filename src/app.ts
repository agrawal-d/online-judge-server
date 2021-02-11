import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import authRouter, { configureAuth } from "./routes/auth";

import passport from "passport";
import session from "express-session";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "gorange gopte",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Enable CORS
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.static(path.join(__dirname, path.sep, "..", path.sep, "public")));
configureAuth();
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

module.exports = app;
