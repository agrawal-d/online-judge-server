import dotenv from "dotenv";
dotenv.config();

function isProduction() {
  return process.env.NODE_ENV === "production";
}

export default {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  MONGODB_URI: process.env.MONGODB_URI,
  hostname: isProduction() ? "https://bits-judge-server.herokuapp.com" : "http://localhost:3000",
  heroku_url: "https://bits-judge-server.herokuapp.com",
  client: isProduction() ? "https://bits-judge.herokuapp.com" : "http://localhost:3001",
};
