import { RequestHandler } from "express";
import { pool } from "../database/config";
import { AuthRequest } from "../utils/auth";
import { z } from "zod";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "test_key_id",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "test_key_secret",
});

const createOrderSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("INR"),
  items: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number().positive(),
      price: z.number().positive(),
      selectedSize: z.string().optional(),
      selectedColor: z.string().optional(),
    }),
  ),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    country: z.string().default("India"),
  }),
});

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  orderId: z.string().uuid(), 
});

export const createOrder: RequestHandler = async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const validatedData = createOrderSchema.parse(req.body);
    const { amount, currency, items, shippingAddress } = validatedData;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `order_${Date.now()}`,
    });

    // Create order in database
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, total_amount, payment_id, shipping_address) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [req.user.id, amount, razorpayOrder.id, JSON.stringify(shippingAddress)],
    );

    const orderId = orderResult.rows[0].id;

    // Create order items
    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price, selected_size, selected_color)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          orderId,
          item.productId,
          item.quantity,
          item.price,
          item.selectedSize,
          item.selectedColor,
        ],
      );

      // Update product stock
      await pool.query(
        "UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2",
        [item.quantity, item.productId],
      );
    }

    res.status(201).json({
      message: "Order created successfully",
      orderId,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyPayment: RequestHandler = async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const validatedData = verifyPaymentSchema.parse(req.body);
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = validatedData;

    // Verify signature
    const crypto = require("crypto");
    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET || "test_key_secret",
      )
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Update order status
    await pool.query(
      `UPDATE orders SET 
       status = 'confirmed', 
       payment_status = 'completed',
       payment_id = $1,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND user_id = $3`,
      [razorpay_payment_id, orderId, req.user.id],
    );

    res.json({
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrders: RequestHandler = async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const result = await pool.query(
      `SELECT 
        o.*,
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
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id],
    );

    const orders = result.rows.map((row) => ({
      id: row.id,
      totalAmount: parseFloat(row.total_amount),
      status: row.status,
      paymentStatus: row.payment_status,
      paymentId: row.payment_id,
      shippingAddress: row.shipping_address,
      items: row.items || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    res.json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrderById: RequestHandler = async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        o.*,
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
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.id = $1 AND o.user_id = $2
       GROUP BY o.id`,
      [id, req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const row = result.rows[0];
    const order = {
      id: row.id,
      totalAmount: parseFloat(row.total_amount),
      status: row.status,
      paymentStatus: row.payment_status,
      paymentId: row.payment_id,
      shippingAddress: row.shipping_address,
      items: row.items || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    res.json({ order });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
