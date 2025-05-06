// api/price-stats.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const result = await pool.query('SELECT * FROM price_stats ORDER BY id DESC LIMIT 100');
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('❌ API viga:', error);
    return res.status(500).json({ error: 'Andmete laadimine ebaõnnestus' });
  }
}
