import { RequestHandler } from "express";
import { pool } from "../database/config";
import { AuthRequest, requireAdmin } from "../utils/auth";
import { z } from "zod";
import { createProductNotification } from "./notifications";

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

// Sample products data for fallback when database is unavailable
const sampleProducts = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description:
      "High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    mrp: 8999,
    ourPrice: 6999,
    discount: 22,
    rating: 4.5,
    afterExchangePrice: 5999,
    offers: ["Free shipping", "1 year warranty", "30-day return policy"],
    coupons: ["SAVE20", "FIRST10"],
    company: "AudioTech",
    color: "Black",
    size: "One Size",
    weight: "250g",
    height: "20cm",
    category: "electronics" as const,
    inStock: true,
    stockQuantity: 50,
    reviews: [
      {
        id: "r1",
        userId: "u1",
        userName: "John Doe",
        rating: 5,
        comment:
          "Excellent sound quality and comfortable to wear for long periods.",
        date: "2024-01-15T10:30:00Z",
        verified: true,
      },
      {
        id: "r2",
        userId: "u2",
        userName: "Jane Smith",
        rating: 4,
        comment: "Great headphones, but could use better battery life.",
        date: "2024-01-12T14:20:00Z",
        verified: true,
      },
    ],
    faqs: [
      {
        id: "f1",
        question: "What is the battery life?",
        answer:
          "The battery lasts up to 30 hours with noise cancellation off and 20 hours with it on.",
      },
      {
        id: "f2",
        question: "Are they compatible with all devices?",
        answer:
          "Yes, they work with any Bluetooth-enabled device including phones, tablets, and computers.",
      },
    ],
  },
  {
    id: "2",
    name: "Organic Cotton T-Shirt",
    description:
      "Comfortable and sustainable organic cotton t-shirt. Made from 100% organic cotton with a soft feel and perfect fit.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    mrp: 1299,
    ourPrice: 899,
    discount: 31,
    rating: 4.2,
    offers: ["Free shipping above ₹500", "Easy returns"],
    coupons: ["ORGANIC15"],
    company: "EcoWear",
    color: "White",
    size: "M",
    weight: "180g",
    height: "70cm",
    category: "clothes" as const,
    inStock: true,
    stockQuantity: 100,
    reviews: [
      {
        id: "r3",
        userId: "u3",
        userName: "Mike Johnson",
        rating: 4,
        comment: "Very comfortable and good quality material.",
        date: "2024-01-10T09:15:00Z",
        verified: true,
      },
    ],
    faqs: [
      {
        id: "f3",
        question: "How should I wash this t-shirt?",
        answer:
          "Machine wash cold with like colors. Tumble dry low or hang to dry.",
      },
    ],
  },
  {
    id: "3",
    name: "Vitamin C Serum",
    description:
      "Brightening vitamin C serum that helps reduce dark spots and gives you glowing, healthy skin. Suitable for all skin types.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    mrp: 2499,
    ourPrice: 1899,
    discount: 24,
    rating: 4.7,
    offers: ["Buy 2 get 1 free", "Free shipping"],
    coupons: ["GLOW25", "SKINCARE10"],
    company: "GlowCare",
    color: "Clear",
    size: "30ml",
    weight: "50g",
    height: "10cm",
    category: "beauty" as const,
    inStock: true,
    stockQuantity: 75,
    reviews: [],
    faqs: [
      {
        id: "f4",
        question: "Can I use this during the day?",
        answer:
          "Yes, but always follow with sunscreen as vitamin C can make your skin more sensitive to sun.",
      },
    ],
  },
];

export const getAllProducts: RequestHandler = async (req, res) => {
  const { category, search, inStock } = req.query;

  try {
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
        id: row.id,
        name: row.name,
        description: row.description,
        images: row.images || [],
        mrp: parseFloat(row.mrp) || 0,
        ourPrice: parseFloat(row.our_price) || 0,
        discount: row.discount || 0,
        rating: parseFloat(row.rating) || 0,
        afterExchangePrice: row.after_exchange_price
          ? parseFloat(row.after_exchange_price) || 0
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
        stockQuantity: row.stock_quantity || 0,
        reviews: [], // TODO: Fetch reviews separately
        faqs: [], // TODO: Fetch FAQs separately
      })),
    });
  } catch (error) {
    console.error("Get products error:", error);

    // Fallback to sample data when database is not available
    let filteredProducts = [...sampleProducts];

    // Apply filters to sample data
    if (category && category !== "all") {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === category,
      );
    }

    if (search) {
      const searchLower = search.toString().toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower),
      );
    }

    if (inStock === "true") {
      filteredProducts = filteredProducts.filter((p) => p.in_stock);
    }

    res.json({ products: filteredProducts });
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
      id: row.id,
      name: row.name,
      description: row.description,
      images: row.images || [],
      mrp: parseFloat(row.mrp) || 0,
      ourPrice: parseFloat(row.our_price) || 0,
      discount: row.discount || 0,
      rating: parseFloat(row.rating) || 0,
      afterExchangePrice: row.after_exchange_price
        ? parseFloat(row.after_exchange_price) || 0
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
      stockQuantity: row.stock_quantity || 0,
      reviews: [], // TODO: Fetch reviews
      faqs: [], // TODO: Fetch FAQs
    };

    res.json({ product });
  } catch (error) {
    console.error("Get product error:", error);

    // Fallback to sample data when database is not available
    const { id } = req.params;
    const sampleProduct = sampleProducts.find((p) => p.id === id);

    if (sampleProduct) {
      res.json({ product: sampleProduct });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
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

    const afterExchangePrice = parseFloat((ourPrice * 0.95).toFixed(2)); // 5% exchange offer

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
      id: row.id,
      name: row.name,
      description: row.description,
      images: row.images,
      mrp: parseFloat(row.mrp) || 0,
      ourPrice: parseFloat(row.our_price) || 0,
      discount: row.discount || 0,
      rating: parseFloat(row.rating) || 0,
      afterExchangePrice: parseFloat(row.after_exchange_price) || 0,
      offers: row.offers,
      coupons: row.coupons,
      company: row.company,
      color: row.color,
      size: row.size,
      weight: row.weight,
      height: row.height,
      category: row.category,
      inStock: row.in_stock,
      stockQuantity: row.stock_quantity || 0,
      reviews: [],
      faqs: [],
    };

    // ✅ Your UUID-based ID is used here
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
    // Database not available - return appropriate error
    res.status(503).json({
      error:
        "Database not available. Product creation is currently unavailable.",
    });
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
      id: row.id,
      name: row.name,
      description: row.description,
      images: row.images,
      mrp: parseFloat(row.mrp) || 0,
      ourPrice: parseFloat(row.our_price) || 0,
      discount: row.discount || 0,
      rating: parseFloat(row.rating) || 0,
      afterExchangePrice: row.after_exchange_price
        ? parseFloat(row.after_exchange_price) || 0
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
      stockQuantity: row.stock_quantity || 0,
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
    // Database not available - return appropriate error
    res.status(503).json({
      error:
        "Database not available. Product updates are currently unavailable.",
    });
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
    // Database not available - return appropriate error
    res.status(503).json({
      error:
        "Database not available. Product deletion is currently unavailable.",
    });
  }
};

export const getProductsByCategory: RequestHandler = async (req, res) => {
  try {
    const { category } = req.params;
    const { inStock } = req.query;

    let query = "SELECT * FROM products WHERE category = $1";
    const params: any[] = [category];

    if (inStock === "true") {
      query += " AND in_stock = true";
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, params);

    res.json({
      products: result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        images: row.images || [],
        mrp: parseFloat(row.mrp) || 0,
        ourPrice: parseFloat(row.our_price) || 0,
        discount: row.discount || 0,
        rating: parseFloat(row.rating) || 0,
        afterExchangePrice: row.after_exchange_price
          ? parseFloat(row.after_exchange_price) || 0
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
        stockQuantity: row.stock_quantity || 0,
        reviews: [],
        faqs: [],
      })),
    });
  } catch (error) {
    console.error("Get products by category error:", error);

    // Fallback to sample data when database is not available
    const { category } = req.params;
    const { inStock } = req.query;

    let filteredProducts = sampleProducts.filter(
      (p) => p.category === category,
    );

    if (inStock === "true") {
      filteredProducts = filteredProducts.filter((p) => p.in_stock);
    }

    res.json({ products: filteredProducts });
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
      id: row.id,
      name: row.name,
      image:
        row.images && row.images.length > 0
          ? row.images[0]
          : "/placeholder.svg",
      category: row.category,
      price: parseFloat(row.our_price) || 0,
    }));

    res.json({ suggestions });
  } catch (error) {
    console.error("Search suggestions error:", error);

    // Fallback to sample data when database is not available
    const { q } = req.query;

    if (!q || typeof q !== "string" || q.trim().length < 2) {
      return res.json({ suggestions: [] });
    }

    const searchTerm = q.trim().toLowerCase();
    const suggestions = sampleProducts
      .filter(
        (p) =>
          p.in_stock &&
          (p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)),
      )
      .slice(0, 10)
      .map((product) => ({
        id: product.id,
        name: product.name,
        image:
          product.images && product.images.length > 0
            ? product.images[0]
            : "/placeholder.svg",
        category: product.category,
        price: product.ourPrice,
      }));

    res.json({ suggestions });
  }
};
