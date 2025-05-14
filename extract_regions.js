import fs from "fs";
import { parse } from "csv-parse";

const filePath = "Kinnisvara hinnastatistika Harjumaa-Tallinn-2024.csv";
const outputPath = "regionList.json";

const extractRegions = async () => {
  const regions = new Set();
  const parser = fs
    .createReadStream(filePath)
    .pipe(parse({ delimiter: ",", relax_column_count: true, from_line: 7, trim: true }));

  for await (const row of parser) {
    const region = row[1]?.trim();
    if (!region || region.toUpperCase() === "KOKKU") continue;
    regions.add(region);
  }

  const regionList = Array.from(regions).sort();
  fs.writeFileSync(outputPath, JSON.stringify(regionList, null, 2), "utf-8");
  console.log(`✅ Leiti ${regionList.length} unikaalset piirkonda. Salvestatud faili ${outputPath}`);
};

extractRegions(); 