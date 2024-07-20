import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getSales } from "../controllers/salesController.js";

const router = express.Router();

router.use(authMiddleware);
router.route("/").get(getSales);

export default router;
