import { RequestHandler } from "express";
import { pool } from "../database/config";
import { AuthRequest } from "../utils/auth";
import { z } from "zod";

const reviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1),
});

export const createReview: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const { productId, rating, comment } = reviewSchema.parse(req.body);

    const purchaseResult = await pool.query(
      `
      SELECT 1 FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      AND oi.product_id = $2
      AND o.status = 'confirmed'
      LIMIT 1
      `,
      [req.user.id, productId],
    );

    console.log("req.user.id:", req.user.id);
    console.log("productId :", productId);

    // if (purchaseResult.rowCount === 0) {
    //   return res.status(403).json({ error: "You can only review products you purchased." });
    // }

    await pool.query(
      `
      INSERT INTO reviews (product_id, user_id, rating, comment, verified)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [productId, req.user.id, rating, comment, true],
    );

    res.status(201).json({ message: "Review submitted successfully." });
  } catch (error) {
    console.error("Create review error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductReviews: RequestHandler = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await pool.query(
      `
      SELECT
        r.id,
        r.rating,
        r.comment,
        r.verified,
        r.created_at as date,
        u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = $1
      ORDER BY r.created_at DESC
      `,
      [productId],
    );

    const reviews = result.rows.map((row) => ({
      id: row.id.toString(),
      userId: row.user_id,
      userName: row.user_name,
      rating: row.rating,
      comment: row.comment,
      date: row.date,
      verified: row.verified,
    }));

    res.json({ reviews });
  } catch (error) {
    console.error("Get product reviews error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
