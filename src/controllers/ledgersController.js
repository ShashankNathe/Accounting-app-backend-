import asyncHandler from "express-async-handler";

export const getLedgers = asyncHandler(async (req, res) => {
  res.json({ message: "Ledgers fetched successfully" });
});
