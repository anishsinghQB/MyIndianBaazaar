import { pool } from "./config";

const sampleProducts = [
  {
    name: "Premium Cotton T-Shirt",
    description:
      "Comfortable and stylish cotton t-shirt perfect for everyday wear. Made from 100% organic cotton with a soft feel and durable construction.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400",
    ],
    mrp: 999,
    ourPrice: 699,
    company: "Fashion Hub",
    color: "Blue",
    size: "M",
    weight: "200g",
    height: "70cm",
    category: "clothes",
    offers: ["Free delivery on orders above ₹500", "Easy 30-day returns"],
    coupons: ["FIRST10", "COTTON20"],
  },
  {
    name: "Wireless Bluetooth Headphones",
    description:
      "High-quality wireless headphones with noise cancellation and 24-hour battery life. Perfect for music lovers and professionals.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400",
    ],
    mrp: 4999,
    ourPrice: 2999,
    company: "TechSound",
    color: "Black",
    size: "Standard",
    weight: "250g",
    height: "18cm",
    category: "electronics",
    offers: ["1-year warranty", "Free shipping"],
    coupons: ["TECH15", "AUDIO25"],
  },
  {
    name: "Organic Face Cream",
    description:
      "Natural organic face cream enriched with vitamin E and aloe vera. Suitable for all skin types and provides 24-hour hydration.",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    ],
    mrp: 1499,
    ourPrice: 899,
    company: "NaturalGlow",
    color: "White",
    size: "50ml",
    weight: "80g",
    height: "8cm",
    category: "beauty",
    offers: ["Dermatologist tested", "30-day money-back guarantee"],
    coupons: ["BEAUTY10", "NATURAL15"],
  },
];

const generateProductId = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `${timestamp}${randomPart}`.toUpperCase();
};

export const seedProducts = async () => {
  const client = await pool.connect();

  try {
    console.log("Starting to seed sample products...");

    for (const product of sampleProducts) {
      const productId = generateProductId();
      const calculatedDiscount = Math.round(
        ((product.mrp - product.ourPrice) / product.mrp) * 100,
      );
      const afterExchangePrice = product.ourPrice * 0.95;

      await client.query(
        `INSERT INTO products (
          id, name, description, images, mrp, our_price, discount, after_exchange_price,
          offers, coupons, company, color, size, weight, height, category,
          in_stock, stock_quantity, rating
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        ON CONFLICT (id) DO NOTHING`,
        [
          productId,
          product.name,
          product.description,
          product.images,
          product.mrp,
          product.ourPrice,
          calculatedDiscount,
          afterExchangePrice,
          product.offers || [],
          product.coupons || [],
          product.company,
          product.color,
          product.size,
          product.weight,
          product.height,
          product.category,
          true, // in_stock
          50, // stock_quantity
          4.2 + Math.random() * 0.8, // rating between 4.2 and 5.0
        ],
      );

      console.log(`Seeded product: ${product.name} with ID: ${productId}`);
    }

    console.log("Sample products seeded successfully!");
  } catch (error) {
    console.error("Error seeding products:", error);
    throw error;
  } finally {
    client.release();
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedProducts()
    .then(() => {
      console.log("Seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}
