import { RequestHandler } from "express";
import { z } from "zod";
import { AuthRequest } from "../utils/auth";
import { Review } from "../models/reviewModel";
import { Order } from "../models/orderModel";
import { OrderItem } from "../models/OrderdItem";
import { User } from "../models/userModel";

const reviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1),
});

export const createReview: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const { productId, rating, comment } = reviewSchema.parse(req.body);

    // 🧠 Check if user purchased the product
    const order = await Order.findOne({
      where: {
        user_id: req.user.id,
        status: "confirmed",
      },
      include: {
        model: OrderItem,
        where: { product_id: productId },
      },
    });

    if (!order) {
      return res
        .status(403)
        .json({ error: "You can only review products you purchased." });
    }

    // ✅ Insert review
    await Review.create({
      product_id: productId,
      user_id: req.user.id,
      rating,
      comment,
      verified: true,
    });

    res.status(201).json({ message: "Review submitted successfully." });
  } catch (error) {
    console.error("Create review error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res
      .status(503)
      .json({ error: "Database not available. Review submission failed." });
  }
};

export const getProductReviews: RequestHandler = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.findAll({
      where: { product_id: productId },
      include: {
        model: User,
        attributes: ["name"],
      },
      order: [["createdAt", "DESC"]],
    });

    const formatted = reviews.map((review: any) => ({
      id: review.id,
      userId: review.user_id,
      userName: review.User?.name || "Anonymous",
      rating: review.rating,
      comment: review.comment,
      date: review.createdAt,
      verified: review.verified,
    }));

    res.json({ reviews: formatted });
  } catch (error) {
    console.error("Get product reviews error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
