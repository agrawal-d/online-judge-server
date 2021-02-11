import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Enable CORS
app.use((_req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});
app.use(
  express.static(path.join(__dirname, path.sep, "..", path.sep, "public"))
);
app.use("/", indexRouter);
app.use("/users", usersRouter);

module.exports = app;
