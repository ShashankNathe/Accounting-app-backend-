import express from "express";
import { getCustomers, getCustomerById, createCustomer, updateCustomer } from "../controllers/customersController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// router.use(authMiddleware);
router.route("/").get(getCustomers).post(createCustomer);
router.route("/:id").get(getCustomerById).patch(updateCustomer);

export default router;
