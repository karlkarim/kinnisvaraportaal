// /api/regions.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  try {
    const result = await pool.query('SELECT * FROM regions');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Andmete laadimine ebaõnnestus', error);
    res.status(500).json({ error: 'Server error' });
  }
}
