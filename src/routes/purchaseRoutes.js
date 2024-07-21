import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createPurchase, deletePurchase, getPurchaseById, getPurchases, updatePurchase } from "../controllers/purchasesController.js";

const router = express.Router();

// router.use(authMiddleware);
router.route("/").get(getPurchases).post(createPurchase);
router.route("/:id").get(getPurchaseById).put(updatePurchase).delete(deletePurchase);

export default router;
