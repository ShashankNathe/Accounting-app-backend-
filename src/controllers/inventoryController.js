import asyncHandler from "express-async-handler";

export const getInventory = asyncHandler(async (req, res) => {
  res.json({ message: "Inventory fetched successfully" });
});
