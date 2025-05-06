import xlsx from "xlsx";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

// PostgreSQL ühendus
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Laeme Exceli faili ja lehe
const workbook = xlsx.readFile("Kinnisvara hinnastatistika (2).xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const json = xlsx.utils.sheet_to_json(sheet, { range: 4 });

// Piirkond ja periood
const rawRegion = String(sheet["A1"]?.v ?? "Tundmatu piirkond");
const rawPeriod = String(sheet["A2"]?.v ?? "Tundmatu periood");

// Leiame mediaani veeru võtme dünaamiliselt
let medianField;

for (const row of json) {
  for (const key of Object.keys(row)) {
    const val = parseFloat(row[key]);
    if (!isNaN(val)) {
      medianField = key;
      console.log("🔍 Leitud sobiv veerg:", key);
      break;
    }
  }
  if (medianField) break;
}


console.log("🔍 Leitud mediaani veerg:", medianField);

// Sisestatavad andmed
const inserts = [];

for (const row of json) {
  const price = parseFloat(row[medianField]);
  console.log("Toores hind väärtus:", row[medianField]);

  if (!isNaN(price)) {
    inserts.push({
      region: rawRegion.trim(),
      period: rawPeriod.trim(),
      median_price_per_m2: price,
    });
  }
}

console.log("📦 Sisestatavate ridade arv:", inserts.length);

const insertData = async () => {
  try {
    for (const r of inserts) {
      console.log("Sisestan:", r.region, r.period, r.median_price_per_m2);
      await pool.query(
        "INSERT INTO price_stats (region, period, median_price_per_m2) VALUES ($1, $2, $3)",
        [r.region, r.period, r.median_price_per_m2]
      );
    }
    console.log("✅ Andmed edukalt sisestatud.");
  } catch (err) {
    console.error("❌ Viga sisestamisel:", err);
  } finally {
    await pool.end();
  }
};

insertData();
