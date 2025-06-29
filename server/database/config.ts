import { Pool } from "pg";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "postgres",
  password: process.env.DB_PASSWORD || "IndianBaazaar@2004",
  port: parseInt(process.env.DB_PORT || "5432"),
});

// Initialize database tables

export const sequelize = new Sequelize(
  process.env.DB_NAME || "postgres",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "IndianBaazaar@2004",
  {
    host: process.env.HOST_NAME,
    port: Number(process.env.PORT_NUMBER) || 5432,
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
    timezone: "+00:00",
  },
);

export const connectToPgSqlDB = async () => {
  // Skip database connection in development if DB_REQUIRED is false
  if (
    process.env.NODE_ENV === "development" &&
    process.env.DB_REQUIRED === "false"
  ) {
    console.log("Database connection skipped (development mode)");
    return;
  }

  pool.connect((err, client, release) => {
    if (err) {
      console.error("Connection error: hai ", err);
      return;
    }

    client.query("SELECT NOW()", (err, result) => {
      release();
      if (err) {
        return console.error("Error executing query:", err);
      }
      console.log("PostgreSQL Database connected @", result.rows[0].now);
    });
  });
};

export const initializeDatabase = async () => {
  // Skip database initialization in development if DB_REQUIRED is false
  if (
    process.env.NODE_ENV === "development" &&
    process.env.DB_REQUIRED === "false"
  ) {
    console.log("Database initialization skipped (development mode)");
    return;
  }

  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        mobile_number VARCHAR(20),
        gender VARCHAR(10),
        role VARCHAR(20) DEFAULT 'user',
        google_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        images TEXT[],
        mrp DECIMAL(10,2) NOT NULL,
        our_price DECIMAL(10,2) NOT NULL,
        discount INTEGER,
        rating DECIMAL(3,2) DEFAULT 0,
        after_exchange_price DECIMAL(10,2),
        offers TEXT[],
        coupons TEXT[],
        company VARCHAR(255),
        color VARCHAR(100),
        size VARCHAR(100),
        weight VARCHAR(100),
        height VARCHAR(100),
        category VARCHAR(100),
        in_stock BOOLEAN DEFAULT true,
        stock_quantity INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        payment_id VARCHAR(255),
        payment_status VARCHAR(50) DEFAULT 'pending',
        shipping_address JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create order_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        selected_size VARCHAR(100),
        selected_color VARCHAR(100)
      )
    `);

    // Create reviews table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};
