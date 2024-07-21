import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/productsController.js";

const router = express.Router();

// router.use(authMiddleware);
router.route("/").get(getProducts).post(createProduct);
router.route("/:id").get(getProductById).put(updateProduct).delete(deleteProduct);

export default router;
