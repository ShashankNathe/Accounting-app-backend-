import asyncHandler from "express-async-handler";

export const getPurchases = asyncHandler(async (req, res) => {
  res.json({ message: "Purchases fetched successfully" });
});
