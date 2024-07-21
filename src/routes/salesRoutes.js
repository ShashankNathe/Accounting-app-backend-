import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createSale, deleteSale, getSaleById, getSales, updateSale } from "../controllers/salesController.js";

const router = express.Router();

// router.use(authMiddleware);
router.route("/").get(getSales).post(createSale);
router.route("/:id").get(getSaleById).put(updateSale).delete(deleteSale);

export default router;
