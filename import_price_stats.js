import fs from "fs";
import { parse } from "csv-parse";
import pg from "pg";
import dotenv from "dotenv";
const regionList = JSON.parse(fs.readFileSync("regionList.json", "utf-8"));

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const filePath = "Kinnisvara hinnastatistika Harjumaa-Tallinn-2024.csv";

const monthMap = {
  jaanuar: "01",
  veebruar: "02",
  märts: "03",
  aprill: "04",
  mai: "05",
  juuni: "06",
  juuli: "07",
  august: "08",
  september: "09",
  oktoober: "10",
  november: "11",
  detsember: "12"
};

function normalizePeriod(period) {
  if (!period) return null;
  const [year, monthEst] = period.split(" ");
  const month = monthMap[monthEst?.toLowerCase()];
  if (year && month) return `${year}-${month}`;
  return period; // fallback
}

const parseNum = (val) => {
  if (typeof val === "number") return val;
  if (typeof val === "string" && val.trim() !== "***") {
    const cleaned = val.replace(/,/g, "").replace(/\s/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }
  return null;
};

const importData = async () => {
  let rowCount = 0;
  let skipped = 0;
  let lastRegion = null;
  let lastPeriod = null;
  const parser = fs
    .createReadStream(filePath)
    .pipe(parse({ delimiter: ",", relax_column_count: true, from_line: 7, trim: true }));

  for await (const row of parser) {
    // 0: periood, 1: piirkond, 2: suurusgrupp, 3: arv, 4: keskmine pindala, 5: summa kokku, 6: min, 7: max
    // 8: min €/m2, 9: max €/m2, 10: mediaan €/m2, 11: keskmine €/m2, 12: stddev €/m2
    if (!row[0] && !row[1] && !row[2]) {
      console.log('⏩ Vahele jäetud: tühjad veerud', row);
      continue;
    }
    let period = row[0]?.trim();
    if (period) {
      lastPeriod = period;
    } else {
      period = lastPeriod;
    }
    const normalizedPeriod = normalizePeriod(period);
    if (!normalizedPeriod) {
      console.log('⏩ Vahele jäetud: periood puudub', row);
      skipped++;
      continue;
    }
    let region = row[1]?.trim();
    if (region) {
      lastRegion = region;
    } else {
      region = lastRegion;
    }
    const size_group = row[2]?.trim() || null;
    const isKokku = size_group && size_group.toUpperCase() === "KOKKU";

    // Jäta vahele, kui piirkond pole lubatud nimekirjas
    if (!regionList.includes(region)) {
      console.log('⏩ Vahele jäetud: piirkond ei ole lubatud nimekirjas', region);
      skipped++;
      continue;
    }

    // Suurusgruppide read: impordi ainult kui tehinguid >= 5
    if (!isKokku) {
      if (row[3] === "***" || parseNum(row[3]) === null) {
        console.log('⏩ Vahele jäetud: tehingute arv puudub või ***', row);
        skipped++;
        continue;
      }
      if (parseNum(row[3]) < 5) {
        console.log('⏩ Vahele jäetud: tehinguid vähem kui 5', row);
        skipped++;
        continue;
      }
    }
    // KOKKU rida: impordi alati, isegi kui tehinguid < 5 või puuduvad
    if (isKokku) {
      console.log('✅ KOKKU rida imporditakse:', { period, region, size_group, transaction_count: row[3] });
    }

    // Kõik väärtused: kui '***', siis null
    const transaction_count = parseNum(row[3]);
    const avg_area_m2 = parseNum(row[4]);
    const total_sum_eur = parseNum(row[5]);
    const min_price_eur = parseNum(row[6]);
    const max_price_eur = parseNum(row[7]);
    const min_price_per_m2 = parseNum(row[8]);
    const max_price_per_m2 = parseNum(row[9]);
    const median_price_per_m2 = parseNum(row[10]);
    const avg_price_per_m2 = parseNum(row[11]);
    const stddev_price_per_m2 = parseNum(row[12]);

    try {
      const result = await pool.query(
        `INSERT INTO price_stats (
          period, region, size_group, transaction_count, avg_area_m2,
          total_sum_eur, min_price_eur, max_price_eur,
          min_price_per_m2, max_price_per_m2,
          median_price_per_m2, avg_price_per_m2, stddev_price_per_m2
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8,
          $9, $10,
          $11, $12, $13
        ) RETURNING id`,
        [
          normalizedPeriod, region, size_group, transaction_count, avg_area_m2,
          total_sum_eur, min_price_eur, max_price_eur,
          min_price_per_m2, max_price_per_m2,
          median_price_per_m2, avg_price_per_m2, stddev_price_per_m2,
        ]
      );
      console.log(`✅ Rida imporditud (ID: ${result.rows[0].id})`, { period, region, size_group });
      rowCount++;
    } catch (error) {
      console.error(`❌ Viga: ${error.message}`);
      console.error("Andmed:", {
        period, region, size_group, transaction_count, avg_area_m2,
        total_sum_eur, min_price_eur, max_price_eur,
        min_price_per_m2, max_price_per_m2,
        median_price_per_m2, avg_price_per_m2, stddev_price_per_m2
      });
    }
  }
  await pool.end();
  console.log(`\n✅ Imporditi ${rowCount} rida. Vahele jäeti ${skipped} rida (alla 5 tehingu või puudulikud, v.a KOKKU).`);
};

importData();
