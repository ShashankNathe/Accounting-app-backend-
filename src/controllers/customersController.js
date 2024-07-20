import asyncHandler from "express-async-handler";
import { turso } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const getCustomers = asyncHandler(async (req, res) => {
  const data = await turso.execute("SELECT * FROM customers");
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "No customers found" });
  }
  res.json({ status: "success", data: data.rows });
});

export const getCustomerById = asyncHandler(async (req, res) => {
  const data = await turso.execute(`SELECT * FROM customers WHERE id = '${req.params.id}'`);
  if (data.rows.length === 0) {
    res.status(404).json({ status: "error", error: "Customer not found" });
  }
  res.json({ status: "success", data: data.rows[0] });
});

export const createCustomer = asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;
  if (!name) {
    res.status(400).json({ status: "error", error: "Please provide name field" });
  }
  const id = uuidv4();

  try {
    const query = `
        INSERT INTO customers (id, name, email, phone, address)
        VALUES ('${id}', '${name}', '${email ? email : null}', '${phone ? phone : null}', '${address ? address : null}')
    `;
    await turso.execute(query);

    res.status(201).json({ id, name, email, phone, address });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;

  if (!req.params.id) {
    res.status(400).json({ status: "error", error: "Please provide customer id" });
  }

  if (!name) {
    res.status(400).json({ status: "error", error: "Please provide name field" });
  }
  try {
    const query = `
        UPDATE customers SET name = '${name}', email = '${email ? email : null}', phone = '${phone ? phone : null}', address = '${
      address ? address : null
    }', updated_at = CURRENT_TIMESTAMP WHERE id = '${req.params.id}'
    `;
    await turso.execute(query);

    res.json({ status: "success", message: "Customer updated" });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ status: "error", error: "Please provide customer id" });
  }
  try {
    const query = `DELETE FROM customers WHERE id = '${req.params.id}'`;
    await turso.execute(query);
    res.json({ status: "success", message: "Customer deleted" });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});
