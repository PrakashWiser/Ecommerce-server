import express from "express";
import {
  movieCreate,
  movieDelete,
  movieIndex,
  movieUpdate,
} from "../controllers/movie.controllers.js";
const router = express.Router();

router.get("/", movieIndex);
router.post("/", movieCreate);
router.put("/:id", movieUpdate);
router.delete("/:id", movieDelete);
export default router;
