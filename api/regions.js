// /api/regions.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  try {
    const result = await pool.query(`
      SELECT DISTINCT region
      FROM price_stats
      WHERE region IS NOT NULL
      ORDER BY region
    `);

    res.status(200).json(
      result.rows.map(r => ({
        name: r.region,
      }))
    );
  } catch (error) {
    console.error('❌ Piirkondade laadimine ebaõnnestus:', error);
    res.status(500).json({ error: 'Serveri viga' });
  }
}
