import app from "./app.js";
import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URL;

//run server:
app.listen(process.env.PORT, () => {
  console.log("server run at port " + process.env.PORT);
});

//connect to database:
mongoose
  .connect(mongoUri)
  .then(async () => {
    console.log("connected to db");
  })

  .catch((err) => {
    console.log(process.env.MONGO_URL);
    
    console.log("Database connection error:", err.message);
    console.log(
      "If you are using mongodb+srv, make sure your network can resolve Atlas SRV records or switch MONGO_URL to a reachable mongodb:// connection string."
    );
  });
