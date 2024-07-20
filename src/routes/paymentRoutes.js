import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getPayments } from "../controllers/paymentsController.js";

const router = express.Router();

router.use(authMiddleware);
router.route("/").get(getPayments);

export default router;
