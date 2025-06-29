import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { handleDemo } from "./routes/demo";
import { connectToPgSqlDB, initializeDatabase, sequelize } from "./database/config";
import { authenticateToken, requireAdmin } from "./utils/auth";

// Auth routes
import { register, login, getProfile, googleAuthCallback } from "./routes/auth";

// Product routes
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./routes/products";

// Payment routes
import {
  createOrder,
  verifyPayment,
  getOrders,
  getOrderById,
} from "./routes/payments";

dotenv.config();

export function createServer() {
  const app = express();

  // Initialize database
  initializeDatabase().catch(console.error);
  connectToPgSqlDB().catch(console.error);

  sequelize.sync({ alter: true })
  .then(() => {
    console.log('Tables synced');

    app.listen(process.env.PORT || 4000, () => {
      console.log('Server started...');
    });
  })
  .catch((err) => {
    console.error('Unable to sync tables:', err);
  });

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.post("/api/auth/google", googleAuthCallback);
  app.get("/api/auth/profile", authenticateToken, getProfile);

  // Product routes
  app.get("/api/products", getAllProducts);
  app.get("/api/products/:id", getProductById);
  app.post("/api/products", authenticateToken, requireAdmin, createProduct);
  app.put("/api/products/:id", authenticateToken, requireAdmin, updateProduct);
  app.delete(
    "/api/products/:id",
    authenticateToken,
    requireAdmin,
    deleteProduct,
  );

  // Payment routes
  app.post("/api/orders", authenticateToken, createOrder);
  app.post("/api/payments/verify", authenticateToken, verifyPayment);
  app.get("/api/orders", authenticateToken, getOrders);
  app.get("/api/orders/:id", authenticateToken, getOrderById);

  return app;
}
