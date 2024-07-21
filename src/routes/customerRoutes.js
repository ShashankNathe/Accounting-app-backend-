import express from "express";
import { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer, getCustomerSales } from "../controllers/customersController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// router.use(authMiddleware);
router.route("/").get(getCustomers).post(createCustomer);
router.route("/:id").get(getCustomerById).put(updateCustomer).delete(deleteCustomer);
router.route("/:id/sales").get(getCustomerSales);

export default router;
