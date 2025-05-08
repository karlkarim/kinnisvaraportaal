import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "Missing region name" });
  }

  try {
    const result = await pool.query(
      `SELECT 
         region,
         ROUND(AVG(median_price_per_m2)::numeric, 0) AS median_price_per_m2,
         ROUND(AVG(avg_area_m2)::numeric, 1) AS avg_area_m2,
         SUM(transaction_count) AS transaction_count,
         SUM(total_sum_eur)::bigint AS total_sum_eur
       FROM price_stats
       WHERE region = $1
       GROUP BY region`,
      [name]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Region not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Piirkonna detailide viga:", error);
    res.status(500).json({ error: "Server error" });
  }
}
