import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  const { region } = req.query;

  try {
    let result;
    if (region) {
      result = await pool.query(
        "SELECT region, period, median_price_per_m2 FROM price_stats WHERE region ILIKE $1 ORDER BY period",
        [`%${region}%`]
      );
    } else {
      result = await pool.query(
        "SELECT region, period, median_price_per_m2 FROM price_stats ORDER BY region, period"
      );
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("API viga:", error);
    res.status(500).json({ error: "Serveri viga" });
  }
}
