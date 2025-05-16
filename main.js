import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import movieRoutes from "./routes/movies.route.js";
import productRoutes from "./routes/product.route.js";
import { errorHandler, notFound } from "./middlewares/errorhandler.js";
import { protect } from "./middlewares/auth.middelware.js";
import authRoutes from "./routes/auth.route.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server is running successfully" });
});

app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

app.get("/api/secret", protect, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
