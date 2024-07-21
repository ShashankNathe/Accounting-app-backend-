import asyncHandler from "express-async-handler";
import { turso } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const getPurchases = asyncHandler(async (req, res) => {
  const data = await turso.execute("SELECT * FROM purchases");
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "No purchases found" });
  }
  res.json({ status: "success", data: data.rows });
});

export const getPurchaseById = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ status: "error", error: "Please provide purchase id" });
  }
  const data = await turso.execute(
    `SELECT p.id, p.supplier_id, p.total_amount, p.date, pi.id as item_id, pi.product_id, pi.quantity, pi.price 
    FROM purchases p 
    JOIN purchases_items pi ON p.id = pi.purchase_id 
    WHERE p.id = '${req.params.id}'`
  );

  const purchase = {
    id: data.rows[0].id,
    supplier_id: data.rows[0].supplier_id,
    total_amount: data.rows[0].total_amount,
    date: data.rows[0].date,
    items: data.rows.map((item) => ({
      id: item.item_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    })),
  };

  res.json({ status: "success", data: purchase });
});

export const createPurchase = asyncHandler(async (req, res) => {
  const { supplier_id, total_amount, date, items } = req.body;

  if (!supplier_id || !total_amount || !date || !items) {
    res.status(400).json({ status: "error", error: "Please provide supplier_id, total_amount, date and items" });
  }
  const id = uuidv4();

  try {
    const query = `
        INSERT INTO purchases (id, supplier_id, total_amount, date)
        VALUES ('${id}', '${supplier_id}', '${total_amount}', '${date}')
    `;
    await turso.execute(query);

    items.forEach(async (item) => {
      const item_id = uuidv4();
      const itemQuery = `
          INSERT INTO purchases_items (id, purchase_id, product_id, quantity, price)
          VALUES ('${item_id}', '${id}', '${item.product_id}', '${item.quantity}', '${item.price}')
      `;
      await turso.execute(itemQuery);
    });

    res.status(201).json({ id, supplier_id, total_amount, date, items });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});

export const updatePurchase = asyncHandler(async (req, res) => {
  const { supplier_id, total_amount, date, items } = req.body;

  if (!req.params.id) {
    res.status(400).json({ status: "error", error: "Please provide purchase id" });
  }

  if (!supplier_id && !total_amount && !date && !items) {
    res.status(400).json({ status: "error", error: "Please provide supplier_id, total_amount, date or items to update" });
  }

  const data = await turso.execute(`SELECT * FROM purchases WHERE id = '${req.params.id}'`);
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "Purchase not found" });
  }

  let query = `UPDATE purchases SET `;
  if (supplier_id) {
    query += `supplier_id = '${supplier_id}', `;
  }
  if (total_amount) {
    query += `total_amount = '${total_amount}', `;
  }
  if (date) {
    query += `date = '${date}', `;
  }
  query = query.slice(0, -2);
  query += ` WHERE id = '${req.params.id}'`;

  try {
    await turso.execute(query);
    if (items) {
      items.forEach(async (item) => {
        const itemQuery = `
            UPDATE purchases_items
            SET quantity = '${item.quantity}', price = '${item.price}'
            WHERE id = '${item.id}'
        `;
        await turso.execute(itemQuery);
      });
    }

    res.json({ status: "success", message: "Purchase updated successfully" });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});

export const deletePurchase = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ status: "error", error: "Please provide purchase id" });
  }
  const data = await turso.execute(`SELECT * FROM purchases WHERE id = '${req.params.id}'`);
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "Purchase not found" });
  }

  try {
    await turso.execute(`DELETE FROM purchases WHERE id = '${req.params.id}'`);
    res.json({ status: "success", message: "Purchase deleted successfully" });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});
