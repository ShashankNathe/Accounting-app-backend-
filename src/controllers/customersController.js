import asyncHandler from "express-async-handler";

export const getCustomers = asyncHandler(async (req, res) => {
  res.json({ message: "Customers fetched successfully" });
});
