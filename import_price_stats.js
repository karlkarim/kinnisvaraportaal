import ExcelJS from "exceljs";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const filePath = "Kinnisvara hinnastatistika (2).xlsx";

const parseNum = (val) => {
  if (typeof val === "number") return val;
  if (typeof val === "string" && val.trim() !== "***") {
    const cleaned = val.replace(",", ".").replace(/\s/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }
  return null;
};

const importData = async () => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.worksheets[0];

  let currentPeriod = null;
  let currentRegion = null;
  let rowCount = 0;

  for (let i = 1; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);
    const [
      period, region, size_group, transaction_count, avg_area_m2,
      total_sum_eur, min_price_eur, max_price_eur,
      min_price_per_m2, max_price_per_m2,
      median_price_per_m2, avg_price_per_m2, stddev_price_per_m2
    ] = row.values.slice(1);

    if (period) currentPeriod = period;
    if (region) currentRegion = region;

    if (currentPeriod && currentRegion && size_group && transaction_count !== undefined) {
      try {
        await pool.query(
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
          )`,
          [
            currentPeriod, currentRegion, size_group,
            parseNum(transaction_count),
            parseNum(avg_area_m2),
            parseNum(total_sum_eur),
            parseNum(min_price_eur),
            parseNum(max_price_eur),
            parseNum(min_price_per_m2),
            parseNum(max_price_per_m2),
            parseNum(median_price_per_m2),
            parseNum(avg_price_per_m2),
            parseNum(stddev_price_per_m2),
          ]
        );
        rowCount++;
      } catch (error) {
        console.error(`❌ Viga real ${i} : ${error.message}`);
      }
    }
  }

  await pool.end();
  console.log(`✅ Imporditi ${rowCount} rida.`);
};

importData();
