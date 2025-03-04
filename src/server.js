import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import customerRoutes from "./routes/customerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import ledgerRoutes from "./routes/ledgerRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import purchasesRoutes from "./routes/purchaseRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
dotenv.config();

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/ledgers", ledgerRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/purchases", purchasesRoutes);
app.use("/api/suppliers", supplierRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
