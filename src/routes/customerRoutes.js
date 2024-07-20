import express from "express";
import { getCustomers } from "../controllers/customersController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.route("/").get(getCustomers);

export default router;
