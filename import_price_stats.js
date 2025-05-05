import xlsx from "xlsx";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const workbook = xlsx.readFile("Kinnisvara hinnastatistika.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const json = xlsx.utils.sheet_to_json(sheet, { range: 4 });



const region = sheet["A1"]?.v ?? "Tundmatu piirkond";
const period = sheet["A2"]?.v ?? "Tundmatu periood";


const medianField = "Pinnaühiku hind(eur /m2).2";
const inserts = [];

for (const row of json) {
  const price = parseFloat(row[medianField]);
  if (!isNaN(price)) {
    inserts.push({
      region: region.trim(),
      period: period.trim(),
      median_price_per_m2: price,
    });
  }
}

const insertData = async () => {
  try {
    for (const r of inserts) {
      await pool.query(
        "INSERT INTO price_stats (region, period, median_price_per_m2) VALUES ($1, $2, $3)",
        [r.region, r.period, r.median_price_per_m2]
      );
    }
    console.log("Andmed edukalt sisestatud.");
  } catch (err) {
    console.error("Viga sisestamisel:", err);
  } finally {
    await pool.end();
  }
};

insertData();
