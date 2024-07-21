import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createPayment, deletePayment, getPaymentById, getPayments, updatePayment } from "../controllers/paymentsController.js";

const router = express.Router();

// router.use(authMiddleware);
router.route("/").get(getPayments).post(createPayment);
router.route("/:id").get(getPaymentById).put(updatePayment).delete(deletePayment);

export default router;
