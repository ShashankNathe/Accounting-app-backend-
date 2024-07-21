import asyncHandler from "express-async-handler";
import { turso } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const getSuppliers = asyncHandler(async (req, res) => {
  const data = await turso.execute("SELECT * FROM suppliers");
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "No suppliers found" });
  }
  res.json({ status: "success", data: data.rows });
});

export const getSupplierById = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ status: "error", error: "Please provide supplier id" });
  }
  const data = await turso.execute(`SELECT * FROM suppliers WHERE id = '${req.params.id}'`);
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "Supplier not found" });
  }
  res.json({ status: "success", data: data.rows[0] });
});

export const createSupplier = asyncHandler(async (req, res) => {
  const { name, address, phone, email } = req.body;

  if (!name || !address || !phone) {
    res.status(400).json({ status: "error", error: "Please provide name, address and phone" });
  }
  const id = uuidv4();

  try {
    const query = `
            INSERT INTO suppliers (id, name, address, phone, email)
            VALUES ('${id}', '${name}', '${address}', '${phone}', '${email ? email : null}')
        `;
    await turso.execute(query);

    res.status(201).json({ id, name, address, phone });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});

export const updateSupplier = asyncHandler(async (req, res) => {
  const { name, address, phone, email } = req.body;

  if (!req.params.id) {
    res.status(400).json({ status: "error", error: "Please provide supplier id" });
  }

  if (!name && !address && !phone) {
    res.status(400).json({ status: "error", error: "Please provide name, address or phone to update" });
  }

  const data = await turso.execute(`SELECT * FROM suppliers WHERE id = '${req.params.id}'`);
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "Supplier not found" });
  }

  let query = `UPDATE suppliers SET `;
  if (name) {
    query += `name = '${name}', `;
  }
  if (address) {
    query += `address = '${address}', `;
  }
  if (phone) {
    query += `phone = '${phone}', `;
  }
  if (email) {
    query += `email = '${email}', `;
  }

  query = query.slice(0, -2);
  query += ` WHERE id = '${req.params.id}'`;

  try {
    await turso.execute(query);
    res.json({ status: "success", message: "Supplier updated" });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});

export const deleteSupplier = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ status: "error", error: "Please provide supplier id" });
  }
  const data = await turso.execute(`SELECT * FROM suppliers WHERE id = '${req.params.id}'`);
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "Supplier not found" });
  }

  try {
    await turso.execute(`DELETE FROM suppliers WHERE id = '${req.params.id}'`);
    res.json({ status: "success", message: "Supplier deleted" });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});

export const getSupplierPurchases = asyncHandler(async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ status: "error", error: "Please provide supplier id" });
    }

    const data = await turso.execute(
      `SELECT p.id AS purchase_id, p.total_amount, p.date AS purchase_date,
              pi.id AS item_id, pi.product_id, pi.quantity, pi.price
         FROM purchases p
         LEFT JOIN purchases_items pi ON p.id = pi.purchase_id
        WHERE p.supplier_id = '${req.params.id}'`
    );

    if (data.rows.length === 0) {
      return res.status(404).json({ status: "error", error: "No purchases found" });
    }

    const transformData = (rows) => {
      const purchasesMap = {};

      rows.forEach((row) => {
        if (!purchasesMap[row.purchase_id]) {
          purchasesMap[row.purchase_id] = {
            id: row.purchase_id,
            total_amount: row.total_amount,
            date: row.purchase_date,
            items: [],
          };
        }
        if (row.item_id) {
          purchasesMap[row.purchase_id].items.push({
            id: row.item_id,
            product_id: row.product_id,
            quantity: row.quantity,
            price: row.price,
          });
        }
      });

      return Object.values(purchasesMap);
    };

    const formattedData = transformData(data.rows);

    res.json({ status: "success", data: formattedData });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});
