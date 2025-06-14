import express from "express";
import { Payment } from "../controllers/paymentController.js";
const router = express.Router();

router.post("/payment", Payment);
export default router;
