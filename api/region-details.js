import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "Missing region name" });
  }

  console.log("📥 Saadud päringu parameetrid:", req.query);

  try {
    const result = await pool.query(
      `SELECT 
         region,
         COUNT(*) AS transaction_count,
         ROUND(AVG(avg_area_m2)::numeric, 1) AS avg_area_m2,
         ROUND(AVG(median_price_per_m2)::numeric, 0) AS median_price_per_m2,
         SUM(total_sum_eur)::bigint AS total_sum_eur
       FROM price_stats
       WHERE region ILIKE '%' || $1 || '%'
       GROUP BY region`,
      [name]
    );

    console.log("✅ Päringu tulemus:", result.rows);

    if (result.rows.length === 0) {
      console.warn("⚠️ Piirkonda ei leitud:", name);
      return res.status(404).json({ error: "Region not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Region details API viga:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
