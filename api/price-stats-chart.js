// /api/price-stats-chart.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  const { region } = req.query;

  if (!region) {
    return res.status(400).json({ error: "Missing region parameter" });
  }

  try {
    const result = await pool.query(
      `SELECT 
         period,
         region,
         SUM(transaction_count) AS transaction_count,
         ROUND(AVG(median_price_per_m2)::numeric, 0) AS median_price_per_m2,
         ROUND(AVG(avg_price_per_m2)::numeric, 0) AS avg_price_per_m2
       FROM price_stats
       WHERE region = $1
       GROUP BY period, region
       ORDER BY period`,
      [region]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Error in price-stats-chart API:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
