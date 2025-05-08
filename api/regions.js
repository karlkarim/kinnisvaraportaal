// /api/regions.js
import { Pool } from 'pg';
import geoRegions from "../src/data/geoRegions"; // otse samast kaustast

export default function handler(req, res) {
  try {
    res.status(200).json(geoRegions);
  } catch (error) {
    console.error("GeoRegions laadimine ebaõnnestus", error);
    res.status(500).json({ error: "Server error" });
  }
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  try {
   
    const result = await pool.query(`
      SELECT DISTINCT region, 
             AVG(lat) AS lat, 
             AVG(lng) AS lng
      FROM price_stats
      WHERE region IS NOT NULL
      GROUP BY region
    `);
    
    res.status(200).json(
      result.rows.map(r => ({
        name: r.region,
        center: [parseFloat(r.lat), parseFloat(r.lng)]
      }))
    );
    
  } catch (error) {
    console.error('Andmete laadimine ebaõnnestus', error);
    res.status(500).json({ error: 'Server error' });
  }
}
