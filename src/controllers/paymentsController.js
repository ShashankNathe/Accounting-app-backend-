import asyncHandler from "express-async-handler";

export const getPayments = asyncHandler(async (req, res) => {
  res.json({ message: "Payments fetched successfully" });
});
