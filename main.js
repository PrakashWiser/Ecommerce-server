import express from "express";
import movieRoutes from "./routes/movies.route.js";
import connectDB from "./lib/db.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = 5001;

connectDB();
app.get("/", (req, res) => {
  res.json({ msg: "This Server" });
});
app.use(express.json());
app.use("/movies", movieRoutes);
app.listen(PORT, () => {
  console.log(`server is Sucessfully runing http://localhost:${PORT}`);
});
