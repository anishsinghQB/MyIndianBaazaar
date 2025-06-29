import { RequestHandler } from "express";
import { pool } from "../database/config";
import { AuthRequest, requireAdmin } from "../utils/auth";
import { z } from "zod";
import { getMockData, addMockNotification } from "../data/mockData";

const notificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.string().min(1, "Type is required"),
  userId: z.number().optional(), // If specified, send to specific user, otherwise to all users
});

// Get all notifications for the authenticated user
export const getUserNotifications: RequestHandler = async (
  req: AuthRequest,
  res,
) => {
  try {
    const userId = req.user?.id;

    const result = await pool.query(
      `SELECT * FROM notifications
       WHERE user_id = $1 OR user_id IS NULL
       ORDER BY created_at DESC`,
      [userId],
    );

    const notifications = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      message: row.message,
      type: row.type,
      isRead: row.is_read,
      createdAt: row.created_at,
    }));

    res.json({ notifications });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Mark notification as read
export const markNotificationAsRead: RequestHandler = async (
  req: AuthRequest,
  res,
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const result = await pool.query(
      `UPDATE notifications
       SET is_read = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND (user_id = $2 OR user_id IS NULL)
       RETURNING id`,
      [id, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create notification (admin only)
export const createNotification: RequestHandler = async (
  req: AuthRequest,
  res,
) => {
  try {
    const validatedData = notificationSchema.parse(req.body);
    const { title, message, type, userId } = validatedData;

    if (userId) {
      // Send to specific user
      const result = await pool.query(
        `INSERT INTO notifications (title, message, type, user_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [title, message, type, userId],
      );

      const notification = {
        id: result.rows[0].id,
        title: result.rows[0].title,
        message: result.rows[0].message,
        type: result.rows[0].type,
        userId: result.rows[0].user_id,
        isRead: result.rows[0].is_read,
        createdAt: result.rows[0].created_at,
      };

      res.status(201).json({
        message: "Notification created successfully",
        notification,
      });
    } else {
      // Send to all users
      const result = await pool.query(
        `INSERT INTO notifications (title, message, type, user_id)
         VALUES ($1, $2, $3, NULL)
         RETURNING *`,
        [title, message, type],
      );

      const notification = {
        id: result.rows[0].id,
        title: result.rows[0].title,
        message: result.rows[0].message,
        type: result.rows[0].type,
        userId: null,
        isRead: result.rows[0].is_read,
        createdAt: result.rows[0].created_at,
      };

      res.status(201).json({
        message: "Notification sent to all users",
        notification,
      });
    }
  } catch (error) {
    console.error("Create notification error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete notification (admin only)
export const deleteNotification: RequestHandler = async (
  req: AuthRequest,
  res,
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM notifications WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Helper function to create product notification
export const createProductNotification = async (
  productName: string,
  productId: string,
) => {
  try {
    await pool.query(
      `INSERT INTO notifications (title, message, type, user_id)
       VALUES ($1, $2, $3, NULL)`,
      [
        "New Product Added!",
        `Check out our new product: ${productName}. Click to view details.`,
        "product_added",
      ],
    );
    console.log("Product notification created successfully");
  } catch (error) {
    console.error("Error creating product notification:", error);
  }
};
