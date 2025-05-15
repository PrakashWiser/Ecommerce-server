import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import movieRoutes from "./routes/movies.route.js";
import { errorHandler, notFound } from "./middlewars/errorhandler.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server is running successfully" });
});

app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
