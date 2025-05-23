import fetch from 'node-fetch';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Helper to fetch and store HPI data
async function fetchAndStoreHPI() {
  // Lisa unikaalne indeks (year, quarter), kui seda pole
  await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_hpi_data_year_quarter ON hpi_data(year, quarter);');

  // Fetch from Statistikaamet (IA028: Eluaseme hinnaindeks, 2010 = 100)
  const response = await fetch('https://andmed.stat.ee/api/v1/et/stat/IA028', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: [
        {
          code: 'Eluaseme liik',
          selection: {
            filter: 'item',
            values: ['1', '2', '3']
          }
        }
      ],
      response: { format: 'json' }
    })
  });
  
  console.log('Statistikaameti API päring tehtud, status:', response.status);
  if (!response.ok) {
    const text = await response.text();
    console.error('Statistikaameti API viga:', response.status, text);
    throw new Error('Statistikaameti API viga');
  }
  const data = await response.json();
  console.log('Statistikaameti API vastus:', JSON.stringify(data, null, 2));

  // Kogu kõik "Kokku" väärtused massiivi
  if (!Array.isArray(data.data)) {
    throw new Error('Statistikaameti API ootamatu struktuur: data.data puudub');
  }
  const inserts = [];
  for (const row of data.data) {
    const [year, quarter, type] = row.key;
    const value = row.values[0];
    if (type === '1') {
      inserts.push([year, quarter, value]);
    }
  }
  if (inserts.length > 0) {
    const valuesSql = inserts.map((_, i) => `($${i*3+1}, $${i*3+2}, $${i*3+3})`).join(',');
    const flat = inserts.flat();
    await pool.query(
      `INSERT INTO hpi_data (year, quarter, value) VALUES ${valuesSql}
       ON CONFLICT (year, quarter) DO NOTHING`, flat
    );
  }
}

export default async function handler(req, res) {
  console.log(">>> HPI endpoint called");
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await fetchAndStoreHPI();
    const result = await pool.query('SELECT year, quarter, value FROM hpi_data ORDER BY year DESC, quarter DESC');
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error in HPI handler:', err);
    return res.status(500).json({ error: err.message });
  }
} 