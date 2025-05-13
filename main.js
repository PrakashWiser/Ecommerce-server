import express from "express";
import movieRoutes from "./routes/movies.route.js";
const app = express();
const PORT = 5001;

app.get("/", (req, res) => {
  res.json({ msg: "This Server" });
});

app.use("/movies", movieRoutes);
app.listen(PORT, () => {
  console.log(`server is Sucessfully runing http://localhost:${PORT}`);
});
