import asyncHandler from "express-async-handler";
import { turso } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const getReceipts = asyncHandler(async (req, res) => {
  const data = await turso.execute("SELECT * FROM receipts");
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "No receipts found" });
  }
  res.json({ status: "success", data: data.rows });
});

export const getReceiptById = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ status: "error", error: "Please provide receipt id" });
  }
  const data = await turso.execute(`SELECT * FROM receipts WHERE id = '${req.params.id}'`);
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "Receipt not found" });
  }
  res.json({ status: "success", data: data.rows[0] });
});

export const createReceipt = asyncHandler(async (req, res) => {
  const { customer_id, amount, receipt_date } = req.body;

  if (!customer_id || !amount || !receipt_date) {
    res.status(400).json({ status: "error", error: "Please provide customer id, amount, payment method and payment date" });
  }
  const id = uuidv4();

  try {
    const query = `
            INSERT INTO receipts (id, customer_id, amount, receipt_date)
            VALUES ('${id}', '${customer_id}', '${amount}', '${receipt_date}')
        `;
    await turso.execute(query);

    res.status(201).json({ id, customer_id, amount, receipt_date });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});

export const updateReceipt = asyncHandler(async (req, res) => {
  const { customer_id, amount, receipt_date } = req.body;

  if (!req.params.id) {
    res.status(400).json({ status: "error", error: "Please provide receipt id" });
  }

  if (!customer_id && !amount && !receipt_date) {
    res.status(400).json({ status: "error", error: "Please provide customer id, amount or receipt date to update" });
  }

  const data = await turso.execute(`SELECT * FROM receipts WHERE id = '${req.params.id}'`);
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "Receipt not found" });
  }

  const query = `
        UPDATE receipts
        SET customer_id = '${customer_id ? customer_id : data.rows[0].customer_id}',
            amount = '${amount ? amount : data.rows[0].amount}',
            receipt_date = '${receipt_date ? receipt_date : data.rows[0].receipt_date}'
        WHERE id = '${req.params.id}'
    `;
  await turso.execute(query);

  res.json({ status: "success", message: "Receipt updated successfully" });
});

export const deleteReceipt = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ status: "error", error: "Please provide receipt id" });
  }

  const data = await turso.execute(`SELECT * FROM receipts WHERE id = '${req.params.id}'`);
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "Receipt not found" });
  }

  await turso.execute(`DELETE FROM receipts WHERE id = '${req.params.id}'`);
  res.json({ status: "success", message: "Receipt deleted successfully" });
});
