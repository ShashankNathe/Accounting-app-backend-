import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getPurchases } from "../controllers/purchasesController.js";

const router = express.Router();

router.use(authMiddleware);
router.route("/").get(getPurchases);

export default router;
