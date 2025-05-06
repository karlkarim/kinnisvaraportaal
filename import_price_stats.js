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

// Exceli fail ja leht
const workbook = xlsx.readFile("Kinnisvara hinnastatistika.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const json = xlsx.utils.sheet_to_json(sheet, { range: 4 });

// Võta piirkond ja periood päisest (A1 ja A2)
const region = String(sheet["A1"]?.v ?? "Tundmatu piirkond");
const period = String(sheet["A2"]?.v ?? "Tundmatu periood");


// Andmete kogumine
const inserts = [];

for (const row of json) {
  console.log("Exceli rida:", row);
  const price = Object.values(row).find((val) => typeof val === "number");

  if (!isNaN(price)) {
    inserts.push({
      region: region.trim(),
      period: period.trim(),
      median_price_per_m2: price,
    });
  }
}

// Sisestamine PostgreSQL-i
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
