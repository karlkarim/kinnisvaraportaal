import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { pool } from './api/db.js';

async function importTestData() {
  try {
    // Loeme CSV faili
    const fileContent = fs.readFileSync('test_buildings_data.csv', 'utf8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    console.log(`Leitud ${records.length} hoonet importimiseks`);

    // Alustame transaktsiooni
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Tühjendame olemasolevad andmed
      await client.query('TRUNCATE TABLE ehr_buildings');

      // Lisame uued andmed
      for (const record of records) {
        await client.query(
          `INSERT INTO ehr_buildings (
            piirkond, aadress, ehitusaasta, hoone_liik, 
            energiamark, materjal, korruseid, koordinaadid
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            record.piirkond,
            record.aadress,
            record.ehitusaasta,
            record.hoone_liik,
            record.energiamark,
            record.materjal,
            record.korruseid,
            record.koordinaadid
          ]
        );
      }

      // Kinnitame transaktsiooni
      await client.query('COMMIT');
      console.log('Andmed on edukalt imporditud andmebaasi');

    } catch (err) {
      // Võimaliku vea korral tagastame muudatused
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Viga andmete importimisel:', error);
  } finally {
    await pool.end();
  }
}

// Käivitame importimise
importTestData(); 