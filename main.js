import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./lib/db.js";
import productRoutes from "./routes/product.route.js";
import { errorHandler, notFound } from "./middlewares/errorhandler.js";
import { protect } from "./middlewares/auth.middelware.js";
import cloudinary from "cloudinary";
import authRoutes from "./routes/auth.route.js";
import paymentRoutes from "./routes/payment.route.js";
import compression from "compression";
import cors from "cors";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://ecommerce-page-mocha-one.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(compression());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

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
