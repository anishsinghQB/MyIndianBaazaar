import { RequestHandler } from "express";
import { pool } from "../database/config";
import { AuthRequest, requireAdmin } from "../utils/auth";
import { z } from "zod";
import { createProductNotification } from "./notifications";
import {
  getMockData,
  addMockProduct,
  updateMockProduct,
  deleteMockProduct,
} from "../data/mockData";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  mrp: z.number().positive("MRP must be positive"),
  ourPrice: z.number().positive("Price must be positive"),
  discount: z.number().min(0).max(100).optional(),
  offers: z.array(z.string()).optional(),
  coupons: z.array(z.string()).optional(),
  company: z.string().min(1, "Company name is required"),
  color: z.string().optional(),
  size: z.string().optional(),
  weight: z.string().optional(),
  height: z.string().optional(),
  category: z.enum([
    "clothes",
    "beauty",
    "mice",
    "electronics",
    "books",
    "groceries",
    "other",
  ]),
  inStock: z.boolean().default(true),
  stockQuantity: z.number().int().min(0).default(0),
});

export const getAllProducts: RequestHandler = async (req, res) => {
  try {
    // Use mock data if database is not available
    if (
      process.env.NODE_ENV === "development" &&
      process.env.DB_REQUIRED === "false"
    ) {
      const { category, search, inStock } = req.query;
      const mockData = getMockData();
      let products = mockData.products;

      // Apply filters
      if (category) {
        products = products.filter((p) => p.category === category);
      }

      if (search && typeof search === "string") {
        const searchTerm = search.toLowerCase();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm),
        );
      }

      if (inStock === "true") {
        products = products.filter((p) => p.inStock);
      }

      return res.json({ products });
    }

    const { category, search, inStock } = req.query;

    let query = "SELECT * FROM products WHERE 1=1";
    const params: any[] = [];

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }

    if (inStock === "true") {
      query += " AND in_stock = true";
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, params);

    res.json({
      products: result.rows.map((row) => ({
        id: row.id.toString(),
        name: row.name,
        description: row.description,
        images: row.images || [],
        mrp: parseFloat(row.mrp),
        ourPrice: parseFloat(row.our_price),
        discount: row.discount || 0,
        rating: parseFloat(row.rating) || 0,
        afterExchangePrice: row.after_exchange_price
          ? parseFloat(row.after_exchange_price)
          : undefined,
        offers: row.offers || [],
        coupons: row.coupons || [],
        company: row.company,
        color: row.color,
        size: row.size,
        weight: row.weight,
        height: row.height,
        category: row.category,
        inStock: row.in_stock,
        stockQuantity: row.stock_quantity,
        reviews: [], // TODO: Fetch reviews separately
        faqs: [], // TODO: Fetch FAQs separately
      })),
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const row = result.rows[0];
    const product = {
      id: row.id.toString(),
      name: row.name,
      description: row.description,
      images: row.images || [],
      mrp: parseFloat(row.mrp),
      ourPrice: parseFloat(row.our_price),
      discount: row.discount || 0,
      rating: parseFloat(row.rating) || 0,
      afterExchangePrice: row.after_exchange_price
        ? parseFloat(row.after_exchange_price)
        : undefined,
      offers: row.offers || [],
      coupons: row.coupons || [],
      company: row.company,
      color: row.color,
      size: row.size,
      weight: row.weight,
      height: row.height,
      category: row.category,
      inStock: row.in_stock,
      stockQuantity: row.stock_quantity,
      reviews: [], // TODO: Fetch reviews
      faqs: [], // TODO: Fetch FAQs
    };

    res.json({ product });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createProduct: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const validatedData = productSchema.parse(req.body);
    const {
      name,
      description,
      images,
      mrp,
      ourPrice,
      discount,
      offers,
      coupons,
      company,
      color,
      size,
      weight,
      height,
      category,
      inStock,
      stockQuantity,
    } = validatedData;

    const calculatedDiscount =
      discount || Math.round(((mrp - ourPrice) / mrp) * 100);
    const afterExchangePrice = ourPrice * 0.95; // 5% discount for exchange

    // Use mock data if database is not available
    if (
      process.env.NODE_ENV === "development" &&
      process.env.DB_REQUIRED === "false"
    ) {
      const product = addMockProduct({
        name,
        description,
        images,
        mrp,
        ourPrice,
        discount: calculatedDiscount,
        rating: 0,
        afterExchangePrice,
        offers: offers || [],
        coupons: coupons || [],
        company,
        color,
        size,
        weight,
        height,
        category,
        inStock,
        stockQuantity,
        reviews: [],
        faqs: [],
      });

      // Create notification for all users about new product
      try {
        await createProductNotification(product.name, product.id);
      } catch (err) {
        console.log("Note: Notification creation skipped in development mode");
      }

      return res.status(201).json({
        message: "Product created successfully",
        product,
      });
    }

    const result = await pool.query(
      `INSERT INTO products (
        name, description, images, mrp, our_price, discount, after_exchange_price,
        offers, coupons, company, color, size, weight, height, category,
        in_stock, stock_quantity
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`,
      [
        name,
        description,
        images,
        mrp,
        ourPrice,
        calculatedDiscount,
        afterExchangePrice,
        offers || [],
        coupons || [],
        company,
        color,
        size,
        weight,
        height,
        category,
        inStock,
        stockQuantity,
      ],
    );

    const row = result.rows[0];
    const product = {
      id: row.id.toString(),
      name: row.name,
      description: row.description,
      images: row.images,
      mrp: parseFloat(row.mrp),
      ourPrice: parseFloat(row.our_price),
      discount: row.discount,
      rating: parseFloat(row.rating),
      afterExchangePrice: parseFloat(row.after_exchange_price),
      offers: row.offers,
      coupons: row.coupons,
      company: row.company,
      color: row.color,
      size: row.size,
      weight: row.weight,
      height: row.height,
      category: row.category,
      inStock: row.in_stock,
      stockQuantity: row.stock_quantity,
      reviews: [],
      faqs: [],
    };

    // Create notification for all users about new product
    await createProductNotification(product.name, product.id);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProduct: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const validatedData = productSchema.partial().parse(req.body);

    // Build dynamic update query
    const updateFields = [];
    const params = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(validatedData)) {
      if (value !== undefined) {
        const dbField =
          key === "ourPrice"
            ? "our_price"
            : key === "inStock"
              ? "in_stock"
              : key === "stockQuantity"
                ? "stock_quantity"
                : key === "afterExchangePrice"
                  ? "after_exchange_price"
                  : key.replace(/([A-Z])/g, "_$1").toLowerCase();

        updateFields.push(`${dbField} = $${paramCount}`);
        params.push(value);
        paramCount++;
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    // Add updated_at field
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    params.push(id);
    const query = `UPDATE products SET ${updateFields.join(", ")} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const row = result.rows[0];
    const product = {
      id: row.id.toString(),
      name: row.name,
      description: row.description,
      images: row.images,
      mrp: parseFloat(row.mrp),
      ourPrice: parseFloat(row.our_price),
      discount: row.discount,
      rating: parseFloat(row.rating),
      afterExchangePrice: row.after_exchange_price
        ? parseFloat(row.after_exchange_price)
        : undefined,
      offers: row.offers,
      coupons: row.coupons,
      company: row.company,
      color: row.color,
      size: row.size,
      weight: row.weight,
      height: row.height,
      category: row.category,
      inStock: row.in_stock,
      stockQuantity: row.stock_quantity,
      reviews: [],
      faqs: [],
    };

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSearchSuggestions: RequestHandler = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string" || q.trim().length < 2) {
      return res.json({ suggestions: [] });
    }

    const searchTerm = q.trim();
    const result = await pool.query(
      `SELECT id, name, images, category, our_price
       FROM products
       WHERE (name ILIKE $1 OR description ILIKE $1)
       AND in_stock = true
       ORDER BY
         CASE
           WHEN name ILIKE $2 THEN 1
           WHEN name ILIKE $1 THEN 2
           ELSE 3
         END,
         name
       LIMIT 10`,
      [`%${searchTerm}%`, `${searchTerm}%`],
    );

    const suggestions = result.rows.map((row) => ({
      id: row.id.toString(),
      name: row.name,
      image:
        row.images && row.images.length > 0
          ? row.images[0]
          : "/placeholder.svg",
      category: row.category,
      price: parseFloat(row.our_price),
    }));

    res.json({ suggestions });
  } catch (error) {
    console.error("Search suggestions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
