import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
dotenv.config();

import indexRouter from "./routes/index";
import apiRouter from "./routes/api";
import { configureAuth } from "./routes/auth";

import passport from "passport";
import session from "express-session";
import * as database from "./database";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const swaggerSpecification = swaggerJsdoc({
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Backend",
      version: "1.0.0",
    },
  },
  apis: ["src/routes/**/*.ts"],
});

const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

database.init();

app.use(
  session({
    secret: "gorange gopte",
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: false,
      httpOnly: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Enable CORS
app.use((req, res, next) => {
  console.log(req);
  res.append("Access-Control-Allow-Origin", [req.headers.origin]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  res.append("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.static(path.join(__dirname, path.sep, "..", path.sep, "public")));
configureAuth();
app.use("/", indexRouter);
app.use("/api/v0", apiRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecification));

module.exports = app;
