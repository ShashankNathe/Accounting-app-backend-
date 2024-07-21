import asyncHandler from "express-async-handler";
import { turso } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const getSales = asyncHandler(async (req, res) => {
  const data = await turso.execute("SELECT * FROM sales");
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "No sales found" });
  }
  res.json({ status: "success", data: data.rows });
});

export const getSaleById = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ status: "error", error: "Please provide sale id" });
  }
  // const data = await turso.execute(`SELECT * FROM sales WHERE id = '${req.params.id}'`);

  const data = await turso.execute(
    `SELECT s.id, s.customer_id, s.total_amount, s.date, si.id as item_id, si.product_id, si.quantity, si.price
    FROM sales s
    JOIN sales_items si ON s.id = si.sale_id
    WHERE s.id = '${req.params.id}'`
  );
  const sale = {
    id: data.rows[0].id,
    customer_id: data.rows[0].customer_id,
    total_amount: data.rows[0].total_amount,
    date: data.rows[0].date,
    items: data.rows.map((item) => ({
      id: item.item_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    })),
  };
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "Sale not found" });
  }
  res.json({ status: "success", data: sale });
});

export const createSale = asyncHandler(async (req, res) => {
  const { customer_id, total_amount, date, items } = req.body;
  console.log(req.body);
  if (!customer_id || !total_amount || !date || !items) {
    res.status(400).json({ status: "error", error: "Please provide customer_id, total_amount, date and items" });
  }
  const id = uuidv4();

  try {
    const query = `
        INSERT INTO sales (id, customer_id, total_amount, date)
        VALUES ('${id}', '${customer_id}', '${total_amount}', '${date}')
    `;
    await turso.execute(query);

    items.forEach(async (item) => {
      const item_id = uuidv4();
      const itemQuery = `
          INSERT INTO sales_items (id, sale_id, product_id, quantity, price)
          VALUES ('${item_id}', '${id}', '${item.product_id}', '${item.quantity}', '${item.price}')
      `;
      await turso.execute(itemQuery);
    });

    res.status(201).json({ id, customer_id, total_amount, date, items });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});

export const updateSale = asyncHandler(async (req, res) => {
  const { customer_id, total_amount, date, items } = req.body;

  if (!req.params.id) {
    res.status(400).json({ status: "error", error: "Please provide sale id" });
  }

  if (!customer_id || !total_amount || !date || !items) {
    res.status(400).json({ status: "error", error: "Please provide customer_id, total_amount, date and items" });
  }
  try {
    const query = `
        UPDATE sales SET customer_id = '${customer_id}', total_amount = '${total_amount}', date = '${date}', updated_at = CURRENT_TIMESTAMP WHERE id = '${req.params.id}'
    `;
    await turso.execute(query);
    items.forEach(async (item) => {
      const updateQuery = `
      UPDATE sales_items SET product_id = '${item.product_id}', quantity = '${item.quantity}', price = '${item.price}', updated_at = CURRENT_TIMESTAMP WHERE id = '${item.id}'
      `;
      await turso.execute(updateQuery);
    });

    res.json({ status: "success", message: "Sale updated" });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});

export const deleteSale = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ status: "error", error: "Please provide sale id" });
  }
  try {
    const itemQuery = `DELETE FROM sales_items WHERE sale_id = '${req.params.id}';`;
    await turso.execute(itemQuery);

    res.json({ status: "success", message: "Sale deleted" });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});
