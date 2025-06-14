import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./lib/db.js";
import productRoutes from "./routes/product.route.js";
import { errorHandler, notFound } from "./middlewares/errorhandler.js";
import { protect } from "./middlewares/auth.middelware.js";
import authRoutes from "./routes/auth.route.js";
import paymentRoutes from "./routes/payment.route.js";
import cors from "cors";

connectDB();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "✅ Server is running successfully" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/", paymentRoutes);

app.get("/api/secret", protect, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at: http://localhost:${PORT}`);
});
