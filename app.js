import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from 'cors'
import cookieParser from "cookie-parser";
import categoryRouter from "./routes/category.route.js";
import productRouter from "./routes/product.route.js";
import userRouter from "./routes/user.routes.js";
import cartRouter from "./routes/cart.routes.js";
const app = express();

// middlewares
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
//routes:
// for testing the server is working on vercel or not:
app.get("/", (req, res) => {
  return res.json({ mss: "welcome to ecommerce api" });
});
// main routes:
app.use("/category", categoryRouter);
app.use("/products", productRouter);
app.use("/users", userRouter);
app.use("/cart", cartRouter);

//not found middlware:
app.use("/", (req, res) => {
  return res.status(404).json({ mss: "page not found" });
});

// error handling middlware:
app.use((error, req, res, next) => {
  console.log(error.stack);

  return res.status(error.status || 500).json(error.message || "server error");
});

export default app;
