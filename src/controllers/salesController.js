import asyncHandler from "express-async-handler";

export const getSales = asyncHandler(async (req, res) => {
  res.json({ message: "Sales fetched successfully" });
});
