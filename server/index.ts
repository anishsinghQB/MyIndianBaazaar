import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToPgSqlDB, sequelize } from "./database/config.ts";
import { authenticateToken, requireAdmin } from "./utils/auth.ts";
import { Order } from "./models/orderModel.ts";
import { OrderItem } from "./models/OrderdItem.ts";
import { Product } from "./models/productModel.ts";
import { Review } from "./models/reviewModel.ts";
import { User } from "./models/userModel.ts";
import { Notification } from "./models/notificationModel.ts";
import {
  getProfile,
  googleAuthCallback,
  login,
  register,
} from "./controllers/AuthController.ts";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getSearchSuggestions,
  updateProduct,
} from "./controllers/ProductController.ts";
import {
  createNotification,
  deleteNotification,
  getUserNotifications,
  markNotificationAsRead,
} from "./controllers/NotificationController.ts";
import {
  createOrder,
  getOrderById,
  getOrders,
  verifyPayment,
} from "./controllers/OrderController.ts";
import {
  getAllCustomers,
  getAllOrders,
  getDashboardStats,
  updateOrderStatus,
} from "./controllers/AdminController.ts";
import {
  createReview,
  getProductReviews,
} from "./controllers/ReviewController.ts";

dotenv.config();

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  connectToPgSqlDB().catch((error) => {
    console.error("Database connection failed:", error.message);
    console.log("⚠️  Running in development mode without database");
    console.log("📊 Using mock data for API responses");
  });

  // Define associations after all models are loaded
  // Order and User associations
  User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
  Order.belongsTo(User, { foreignKey: "user_id", as: "User" });

  // Order and OrderItem associations
  Order.hasMany(OrderItem, { foreignKey: "order_id", as: "OrderItems" });
  OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "Order" });

  // Product and OrderItem associations
  Product.hasMany(OrderItem, { foreignKey: "product_id", as: "OrderItems" });
  OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "Product" });

  // Review and User associations
  User.hasMany(Review, { foreignKey: "user_id", as: "reviews" });
  Review.belongsTo(User, { foreignKey: "user_id", as: "User" });

  // Review and Product associations
  Product.hasMany(Review, { foreignKey: "product_id", as: "reviews" });
  Review.belongsTo(Product, { foreignKey: "product_id", as: "Product" });

  // Notification and User associations
  User.hasMany(Notification, { foreignKey: "user_id", as: "notifications" });
  Notification.belongsTo(User, { foreignKey: "user_id", as: "User" });

  // Sync database tables - models updated
  sequelize
    .sync({ force: false, alter: false })
    .then(() => {
      console.log("✅ Database tables synced successfully");
    })
    .catch((err) => {
      console.error("❌ Unable to sync tables:", err.message);
      console.log("🔄 API will use mock data fallbacks");
    });

  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.post("/api/auth/google", googleAuthCallback);
  app.get("/api/auth/profile", authenticateToken, getProfile);

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

  app.post("/api/orders", authenticateToken, createOrder);
  app.post("/api/payments/verify", authenticateToken, verifyPayment);
  app.get("/api/orders", authenticateToken, getOrders);
  app.get("/api/orders/:id", authenticateToken, getOrderById);

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

  app.post("/api/reviews", authenticateToken, createReview);
  app.get("/api/products/:productId/reviews", getProductReviews);

  return app;
}
