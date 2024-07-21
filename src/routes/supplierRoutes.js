import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createSupplier, deleteSupplier, getSupplierById, getSupplierPurchases, getSuppliers, updateSupplier } from "../controllers/suppliersController.js";

const router = express.Router();
// router.use(authMiddleware);

router.route("/").get(getSuppliers).post(createSupplier);
router.route("/:id").get(getSupplierById).put(updateSupplier).delete(deleteSupplier);
router.route("/:id/purchases").get(getSupplierPurchases);

export default router;
