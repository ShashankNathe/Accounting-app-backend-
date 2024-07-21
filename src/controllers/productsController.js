import asyncHandler from "express-async-handler";
import { turso } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const getProducts = asyncHandler(async (req, res) => {
  const data = await turso.execute("SELECT * FROM products");
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "No products found" });
  }
  res.json({ status: "success", data: data.rows });
});

export const getProductById = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ status: "error", error: "Please provide product id" });
  }
  const data = await turso.execute(`SELECT * FROM products WHERE id = '${req.params.id}'`);
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "Product not found" });
  }
  res.json({ status: "success", data: data.rows[0] });
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, quantity } = req.body;

  if (!name || !price || !quantity) {
    res.status(400).json({ status: "error", error: "Please provide name, price and quantity" });
  }
  const id = uuidv4();

  try {
    const query = `
        INSERT INTO products (id, name, price, quantity)
        VALUES ('${id}', '${name}', '${price}', '${quantity}')
    `;
    await turso.execute(query);

    res.status(201).json({ id, name, price, quantity });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, quantity } = req.body;

  if (!req.params.id) {
    res.status(400).json({ status: "error", error: "Please provide product id" });
  }

  if (!name && !price && !quantity) {
    res.status(400).json({ status: "error", error: "Please provide name, price or quantity to update" });
  }

  const data = await turso.execute(`SELECT * FROM products WHERE id = '${req.params.id}'`);
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "Product not found" });
  }

  const product = data.rows[0];
  const updatedProduct = {
    name: name || product.name,
    price: price || product.price,
    quantity: quantity || product.quantity,
  };

  try {
    const query = `
        UPDATE products
        SET name = '${updatedProduct.name}', price = '${updatedProduct.price}', quantity = '${updatedProduct.quantity}'
        WHERE id = '${req.params.id}'
    `;
    await turso.execute(query);

    res.json({ status: "success", data: updatedProduct });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ status: "error", error: "Please provide product id" });
  }
  const data = await turso.execute(`SELECT * FROM products WHERE id = '${req.params.id}'`);
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "Product not found" });
  }

  try {
    await turso.execute(`DELETE FROM products WHERE id = '${req.params.id}'`);
    res.json({ status: "success", message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});
