import express from "express";
import { createReceipt, deleteReceipt, getReceiptById, getReceipts, updateReceipt } from "../controllers/receiptsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
// router.use(authMiddleware);

router.route("/").get(getReceipts).post(createReceipt);
router.route("/:id").get(getReceiptById).put(updateReceipt).delete(deleteReceipt);

export default router;
