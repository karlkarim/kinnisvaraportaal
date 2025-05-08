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
         SUM(transaction_count) AS transaction_count
       FROM price_stats
       WHERE region = $1
       GROUP BY period
       ORDER BY period`,
      [region]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Tehingute API viga:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
