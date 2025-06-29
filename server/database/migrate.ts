import { pool } from "./config";

export const migrateProductIds = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    console.log("Starting product ID migration...");

    // Check if products table has numeric ID column
    const checkColumn = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'id'
    `);

    if (
      checkColumn.rows.length > 0 &&
      checkColumn.rows[0].data_type === "integer"
    ) {
      console.log("Found numeric product IDs, migrating to string IDs...");

      // Create a temporary function to generate string IDs
      const generateId = (index: number) => {
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substring(2, 15);
        const indexPart = index.toString(36).padStart(3, "0");
        return `${timestamp}${randomPart}${indexPart}`.toUpperCase();
      };

      // Get all existing products
      const products = await client.query(
        "SELECT id FROM products ORDER BY id",
      );

      if (products.rows.length > 0) {
        // Create temporary table with string IDs
        await client.query(`
          CREATE TABLE products_temp AS 
          SELECT * FROM products WHERE 1=0
        `);

        // Alter temp table to use VARCHAR ID
        await client.query(`
          ALTER TABLE products_temp 
          ALTER COLUMN id TYPE VARCHAR(255)
        `);

        // Insert products with new string IDs
        for (let i = 0; i < products.rows.length; i++) {
          const oldId = products.rows[i].id;
          const newId = generateId(i);

          await client.query(
            `
            INSERT INTO products_temp 
            SELECT $1 as id, name, description, images, mrp, our_price, discount, rating, 
                   after_exchange_price, offers, coupons, company, color, size, weight, 
                   height, category, in_stock, stock_quantity, created_at, updated_at
            FROM products WHERE id = $2
          `,
            [newId, oldId],
          );

          console.log(`Migrated product ${oldId} -> ${newId}`);
        }

        // Drop old table and rename temp
        await client.query("DROP TABLE products CASCADE");
        await client.query("ALTER TABLE products_temp RENAME TO products");

        // Recreate primary key constraint
        await client.query("ALTER TABLE products ADD PRIMARY KEY (id)");

        console.log("Product ID migration completed successfully!");
      }
    } else {
      console.log("Products table already uses string IDs or doesn't exist.");
    }

    // Add metadata column to notifications if it doesn't exist
    const notificationColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'notifications' AND column_name = 'metadata'
    `);

    if (notificationColumns.rows.length === 0) {
      await client.query(`
        ALTER TABLE notifications ADD COLUMN metadata JSONB
      `);
      console.log("Added metadata column to notifications table");
    }

    await client.query("COMMIT");
    console.log("Database migration completed successfully!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", error);
    throw error;
  } finally {
    client.release();
  }
};

// Run migration if called directly
if (require.main === module) {
  migrateProductIds()
    .then(() => {
      console.log("Migration completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}
