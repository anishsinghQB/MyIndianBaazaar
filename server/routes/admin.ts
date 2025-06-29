import { RequestHandler } from "express";
import { pool } from "../database/config";
import { AuthRequest, requireAdmin } from "../utils/auth";

// Get all customers (admin only)
export const getAllCustomers: RequestHandler = async (
  req: AuthRequest,
  res,
) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        email,
        mobile_number,
        gender,
        role,
        created_at,
        (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as total_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE user_id = users.id AND status = 'confirmed') as total_spent
      FROM users
      ORDER BY created_at DESC
    `);

    const customers = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      mobileNumber: row.mobile_number,
      gender: row.gender,
      role: row.role,
      createdAt: row.created_at,
      totalOrders: parseInt(row.total_orders),
      totalSpent: parseFloat(row.total_spent),
    }));

    res.json({ customers });
  } catch (error) {
    console.error("Get customers error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all orders with customer and product details (admin only)
export const getAllOrders: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(`
      SELECT
        o.id,
        o.total_amount,
        o.status,
        o.payment_status,
        o.payment_id,
        o.shipping_address,
        o.created_at,
        o.updated_at,
        u.name as customer_name,
        u.email as customer_email,
        json_agg(
          json_build_object(
            'id', oi.id,
            'productId', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'selectedSize', oi.selected_size,
            'selectedColor', oi.selected_color,
            'productName', p.name,
            'productImage', p.images[1]
          )
        ) as items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      GROUP BY o.id, u.name, u.email
      ORDER BY o.created_at DESC
    `);

    const orders = result.rows.map((row) => ({
      id: row.id,
      totalAmount: parseFloat(row.total_amount),
      status: row.status,
      paymentStatus: row.payment_status,
      paymentId: row.payment_id,
      shippingAddress: row.shipping_address,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      items: row.items || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    res.json({ orders });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get dashboard statistics (admin only)
export const getDashboardStats: RequestHandler = async (
  req: AuthRequest,
  res,
) => {
  try {
    // Get total products
    const productsResult = await pool.query(
      "SELECT COUNT(*) as count FROM products",
    );
    const totalProducts = parseInt(productsResult.rows[0].count);

    // Get total customers
    const customersResult = await pool.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'user'",
    );
    const totalCustomers = parseInt(customersResult.rows[0].count);

    // Get order statistics
    const ordersResult = await pool.query(`
      SELECT
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_orders,
        COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
        COALESCE(SUM(CASE WHEN status = 'confirmed' THEN total_amount END), 0) as total_revenue
      FROM orders
    `);

    const orderStats = ordersResult.rows[0];

    const stats = {
      totalProducts,
      totalCustomers,
      totalOrders: parseInt(orderStats.total_orders),
      pendingOrders: parseInt(orderStats.pending_orders),
      confirmedOrders: parseInt(orderStats.confirmed_orders),
      shippedOrders: parseInt(orderStats.shipped_orders),
      deliveredOrders: parseInt(orderStats.delivered_orders),
      totalRevenue: parseFloat(orderStats.total_revenue),
    };

    res.json({ stats });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update order status (admin only)
export const updateOrderStatus: RequestHandler = async (
  req: AuthRequest,
  res,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid order status" });
    }

    const result = await pool.query(
      "UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [status, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      message: "Order status updated successfully",
      order: result.rows[0],
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
