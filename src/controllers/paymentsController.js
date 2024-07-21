import asyncHandler from "express-async-handler";
import { turso } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const getPayments = asyncHandler(async (req, res) => {
  const data = await turso.execute("SELECT * FROM payments");
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "No payments found" });
  }
  res.json({ status: "success", data: data.rows });
});

export const getPaymentById = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ status: "error", error: "Please provide payment id" });
  }
  const data = await turso.execute(`SELECT * FROM payments WHERE id = '${req.params.id}'`);
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "Payment not found" });
  }
  res.json({ status: "success", data: data.rows[0] });
});

export const createPayment = asyncHandler(async (req, res) => {
  const { supplier_id, amount, payment_date } = req.body;

  if (!supplier_id || !amount || !payment_date) {
    res.status(400).json({ status: "error", error: "Please provide supplier id, amount, payment method and payment date" });
  }
  const id = uuidv4();

  try {
    const query = `
            INSERT INTO payments (id, supplier_id, amount, payment_date)
            VALUES ('${id}', '${supplier_id}', '${amount}', '${payment_date}')
        `;
    await turso.execute(query);

    res.status(201).json({ id, supplier_id, amount, payment_date });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});

export const updatePayment = asyncHandler(async (req, res) => {
  const { supplier_id, amount, payment_date } = req.body;

  if (!req.params.id) {
    res.status(400).json({ status: "error", error: "Please provide payment id" });
  }

  if (!supplier_id && !amount && !payment_date) {
    res.status(400).json({ status: "error", error: "Please provide supplier id, amount or payment date to update" });
  }

  const data = await turso.execute(`SELECT * FROM payments WHERE id = '${req.params.id}'`);
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "Payment not found" });
  }

  const query = `
        UPDATE payments
        SET supplier_id = '${supplier_id || data.rows[0].supplier_id}',
            amount = '${amount || data.rows[0].amount}',
            payment_date = '${payment_date || data.rows[0].payment_date}'
        WHERE id = '${req.params.id}'
    `;

  await turso.execute(query);

  res.json({ status: "success", message: "Payment updated successfully" });
});

export const deletePayment = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ status: "error", error: "Please provide payment id" });
  }

  const data = await turso.execute(`SELECT * FROM payments WHERE id = '${req.params.id}'`);
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "Payment not found" });
  }

  await turso.execute(`DELETE FROM payments WHERE id = '${req.params.id}'`);

  res.json({ status: "success", message: "Payment deleted successfully" });
});
