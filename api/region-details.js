import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const monthMap = {
  Jaanuar: "01",
  Veebruar: "02",
  Märts: "03",
  Aprill: "04",
  Mai: "05",
  Juuni: "06",
  Juuli: "07",
  August: "08",
  September: "09",
  Oktoober: "10",
  November: "11",
  Detsember: "12"
};

export default async function handler(req, res) {
  const { name, aasta, kuud } = req.query;

  if (!name) {
    return res.status(400).json({ error: "Missing region name" });
  }

  // Kuude filter
  let periodFilter = "";
  let periodValues = [];
  if (aasta && kuud) {
    const kuudArr = kuud.split(",");
    periodValues = kuudArr.map(
      (kuu) => `${aasta}-${monthMap[kuu] || "01"}`
    );
    periodFilter = `AND period = ANY($2)`;
  }

  try {
    const query = `
      SELECT 
        region,
        ROUND(AVG(median_price_per_m2)::numeric, 0) AS median_price_per_m2,
        ROUND(AVG(avg_area_m2)::numeric, 1) AS avg_area_m2,
        SUM(transaction_count) AS transaction_count,
        SUM(total_sum_eur)::bigint AS total_sum_eur
      FROM price_stats
      WHERE region = $1
      ${periodFilter}
      GROUP BY region
    `;

    const params = [name];
    if (periodValues.length > 0) params.push(periodValues);

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Region not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Piirkonna detailide viga:", error);
    res.status(500).json({ error: "Server error" });
  }
}
