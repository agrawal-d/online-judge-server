import dotenv from "dotenv";
dotenv.config();

const isDebug = function () {
  return process.env.NODE_ENV !== "production";
};

export default {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  MONGODB_URI: process.env.MONGODB_URI,
  hostname: isDebug ? "http://localhost:3000" : "https://bits-judge-server.herokuapp.com",
  client: "http://localhost:3001",
};
