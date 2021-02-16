import { UserModel, UserClass } from "./models";
import mongoose from "mongoose";
import config from "./config";
import { Profile } from "passport-google-oauth";

export function init(): void {
  mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "Mongoose MongoDB connection error:"));
  db.once("open", function () {
    console.log("Mongoose Connected to MongoDB");
  });
}

export async function getUserById(google_id: string): Promise<UserClass> {
  const p = await UserModel.findOne({ google_id });
  return p;
}

export async function createAccount(profile: Profile): Promise<UserClass> {
  const p = await getUserById(profile.id);
  if (p) {
    throw new Error(`User ${profile.id} already exists`);
  }

  const admin_emails: string[] = JSON.parse(process.env.ADMIN_EMAILS || "[]");
  const is_admin = profile._json.email in admin_emails;

  const newUser = new UserModel({
    name: profile._json.name,
    google_id: profile.id,
    email: profile._json.email,
    picture: profile._json.picture,
    is_admin,
  });
  const savedUser = await newUser.save();

  return savedUser;
}
