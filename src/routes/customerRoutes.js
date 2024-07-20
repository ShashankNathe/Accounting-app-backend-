import express from "express";
import { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from "../controllers/customersController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// router.use(authMiddleware);
router.route("/").get(getCustomers).post(createCustomer);
router.route("/:id").get(getCustomerById).patch(updateCustomer).delete(deleteCustomer);

export default router;
