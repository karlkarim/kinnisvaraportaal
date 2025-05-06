import xlsx from 'xlsx';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const workbook = xlsx.readFile('Kinnisvara hinnastatistika (2).xlsx');
const inserts = [];

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

for (const sheetName of workbook.SheetNames) {
  const worksheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(worksheet, { defval: null });

  const period = sheetName.trim();

  let currentRegion = null;

  for (const row of rows) {
    // Kontrolli võtmeid
    const regionRaw = row['__EMPTY'];
    const medianRaw = row['Pinnaühiku hind(eur /m2)_3'];

    if (regionRaw && typeof regionRaw === 'string') {
      currentRegion = regionRaw.trim();
    }

    if (currentRegion && medianRaw !== null && medianRaw !== '') {
      const median = parseFloat(medianRaw);
      if (!isNaN(median)) {
        inserts.push({ region: currentRegion, period, median });
      }
    }
  }
}

console.log('📦 Sisestatavate ridade arv:', inserts.length);

async function insertData() {
  try {
    for (const entry of inserts) {
      console.log(`➡️ Sisestan: ${entry.region} | ${entry.period} | ${entry.median}`);
      await pool.query(
        'INSERT INTO price_stats (region, period, median_price_per_m2) VALUES ($1, $2, $3)',
        [entry.region, entry.period, entry.median]
      );
    }
    console.log('✅ Andmed edukalt sisestatud.');
  } catch (error) {
    console.error('❌ Viga sisestamisel:', error);
  } finally {
    await pool.end();
  }
}

insertData();
