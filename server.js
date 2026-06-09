import app from "./app.js";
import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to db");

  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });