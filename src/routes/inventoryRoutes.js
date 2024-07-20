import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getInventory } from "../controllers/inventoryController.js";

const router = express.Router();

router.use(authMiddleware);
router.route("/").get(getInventory);

export default router;
