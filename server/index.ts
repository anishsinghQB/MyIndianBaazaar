import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { handleDemo } from "./routes/demo";
import {
  connectToPgSqlDB,
  initializeDatabase,
  sequelize,
} from "./database/config";
import { migrateProductIds } from "./database/migrate";
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
  getSearchSuggestions,
  getProductsByCategory,
} from "./routes/products";

// Notification routes
import {
  getUserNotifications,
  markNotificationAsRead,
  createNotification,
  deleteNotification,
} from "./routes/notifications";

// Payment routes
import {
  createOrder,
  verifyPayment,
  getOrders,
  getOrderById,
} from "./routes/payments";

// Admin routes
import {
  getAllCustomers,
  getAllOrders,
  getDashboardStats,
  updateOrderStatus,
} from "./routes/admin";

dotenv.config();

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize database
  initializeDatabase().catch(console.error);
  connectToPgSqlDB().catch(console.error);

  // Run migration for product IDs
  migrateProductIds().catch(console.error);

  sequelize
    .sync({ alter: true })
    .then(() => {
      console.log("Tables synced");
    })
    .catch((err) => {
      console.error("Unable to sync tables:", err);
    });

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
  app.get("/api/products/search/suggestions", getSearchSuggestions);
  app.get("/api/products/category/:category", getProductsByCategory);
  app.get("/api/products/:id", getProductById);
  app.post("/api/products", authenticateToken, requireAdmin, createProduct);
  app.put("/api/products/:id", authenticateToken, requireAdmin, updateProduct);
  app.delete(
    "/api/products/:id",
    authenticateToken,
    requireAdmin,
    deleteProduct,
  );

  // Notification routes
  app.get("/api/notifications", authenticateToken, getUserNotifications);
  app.patch(
    "/api/notifications/:id/read",
    authenticateToken,
    markNotificationAsRead,
  );
  app.post(
    "/api/notifications",
    authenticateToken,
    requireAdmin,
    createNotification,
  );
  app.delete(
    "/api/notifications/:id",
    authenticateToken,
    requireAdmin,
    deleteNotification,
  );

  // Payment routes
  app.post("/api/orders", authenticateToken, createOrder);
  app.post("/api/payments/verify", authenticateToken, verifyPayment);
  app.get("/api/orders", authenticateToken, getOrders);
  app.get("/api/orders/:id", authenticateToken, getOrderById);

  // Admin routes
  app.get(
    "/api/admin/customers",
    authenticateToken,
    requireAdmin,
    getAllCustomers,
  );
  app.get("/api/admin/orders", authenticateToken, requireAdmin, getAllOrders);
  app.get(
    "/api/admin/stats",
    authenticateToken,
    requireAdmin,
    getDashboardStats,
  );
  app.patch(
    "/api/admin/orders/:id/status",
    authenticateToken,
    requireAdmin,
    updateOrderStatus,
  );

  return app;
}
