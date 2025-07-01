import { RequestHandler } from "express";
import { AuthRequest } from "../utils/auth";
import { User } from "../models/userModel";
import { Order } from "../models/orderModel";
import { Product } from "../models/productModel";
import { Op, fn, col, literal } from "sequelize";
import { OrderItem } from "server/models/OrderdItem";

export const getAllCustomers: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const customers = await User.findAll({
      attributes: {
        include: [
          [
            literal(`(SELECT COUNT(*) FROM orders WHERE orders.user_id = "User".id)`),
            "totalOrders",
          ],
          [
            literal(`(SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE orders.user_id = "User".id AND status = 'confirmed')`),
            "totalSpent",
          ],
        ],
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({ customers });
  } catch (error) {
    console.error("Get customers error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllOrders: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          attributes: ["name", "email"],
        },
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["name", [literal('images[1]'), "productImage"]],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ orders });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDashboardStats: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const totalProducts = await Product.count();
    const totalCustomers = await User.count({ where: { role: "user" } });

    const orderStats = await Order.findAll({
      attributes: [
        [fn("COUNT", col("id")), "totalOrders"],
        [fn("SUM", literal(`CASE WHEN status = 'confirmed' THEN total_amount ELSE 0 END`)), "totalRevenue"],
        [fn("COUNT", literal(`CASE WHEN status = 'pending' THEN 1 END`)), "pendingOrders"],
        [fn("COUNT", literal(`CASE WHEN status = 'confirmed' THEN 1 END`)), "confirmedOrders"],
        [fn("COUNT", literal(`CASE WHEN status = 'shipped' THEN 1 END`)), "shippedOrders"],
        [fn("COUNT", literal(`CASE WHEN status = 'delivered' THEN 1 END`)), "deliveredOrders"],
      ],
      raw: true,
    });

    res.json({
      stats: {
        totalProducts,
        totalCustomers,
        ...orderStats[0],
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateOrderStatus: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid order status" });
    }

    const order : any = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};