import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getLedgers } from "../controllers/ledgersController.js";

const router = express.Router();

// router.use(authMiddleware);
router.route("/").get(getLedgers);

export default router;
