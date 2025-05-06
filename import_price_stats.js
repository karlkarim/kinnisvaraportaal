import xlsx from "xlsx";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Laeme Exceli faili
const workbook = xlsx.readFile("Kinnisvara hinnastatistika (2).xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const json = xlsx.utils.sheet_to_json(sheet, { range: 4 }); // Alustame 5. reast

// Piirkond tuleb esimesest reast (A1 lahter)
const region = sheet["A1"]?.v || "Tundmatu piirkond";
// Periood tuleb teisest reast (A2 lahter)
const period = sheet["A2"]?.v || "Tundmatu periood";

// Kontrollime olemasolevaid võtmeid, et leida mediaanhinna õige veerg
const medianKey = "Pinnaühiku hind(eur /m2)";


if (!medianKey) {
  console.error("❌ Ei leitud sobivat mediaanhinna veergu.");
  process.exit(1);
}

const inserts = [];
for (const row of json) {
  const raw = row[medianKey];
  const price = parseFloat(raw);
  if (!isNaN(price)) {
    inserts.push({
      region: region.trim(),
      period: period.toString().trim(),
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
