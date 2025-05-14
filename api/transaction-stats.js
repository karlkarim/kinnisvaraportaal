import { Pool } from 'pg';

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
  const { region, aasta, kuud } = req.query;

  if (!region) {
    return res.status(400).json({ error: "Missing region parameter" });
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
         period,
         SUM(transaction_count) AS transaction_count
       FROM price_stats
       WHERE region = $1
       ${periodFilter}
       GROUP BY period
       ORDER BY period`;

    const params = [region];
    if (periodValues.length > 0) params.push(periodValues);

    const result = await pool.query(query, params);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Tehingute API viga:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
