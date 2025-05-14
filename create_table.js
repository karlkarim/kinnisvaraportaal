import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS price_stats (
        id SERIAL PRIMARY KEY,
        period TEXT,
        region TEXT,
        size_group TEXT,
        transaction_count INTEGER,
        avg_area_m2 NUMERIC,
        total_sum_eur NUMERIC,
        min_price_eur NUMERIC,
        max_price_eur NUMERIC,
        min_price_per_m2 NUMERIC,
        max_price_per_m2 NUMERIC,
        median_price_per_m2 NUMERIC,
        avg_price_per_m2 NUMERIC,
        stddev_price_per_m2 NUMERIC
      );
    `);
    console.log("✅ Tabel price_stats loodud");
  } catch (error) {
    console.error("❌ Viga tabeli loomisel:", error.message);
  } finally {
    await pool.end();
  }
};

createTable(); 