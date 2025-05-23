import { pool } from './api/db.js';
import xteeClient from './api/xtee-client.js';
import dotenv from 'dotenv';

dotenv.config();

async function importRealData() {
  try {
    // Tallinna linnaosad
    const districts = [
      'Haabersti', 'Kesklinn', 'Kristiine', 'Lasnamäe', 'Mustamäe', 
      'Nõmme', 'Pirita', 'Põhja-Tallinn'
    ];

    console.log('Alustame pärisandmete importimist...');

    // Alustame transaktsiooni
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Tühjendame olemasolevad andmed
      await client.query('TRUNCATE TABLE ehr_buildings');

      // Iga linnaosa kohta teeme päringu
      for (const district of districts) {
        console.log(`Impordime andmeid linnaosast: ${district}`);
        
        // Päring X-tee teenusest
        const buildingData = await xteeClient.getBuildingData(district);
        
        // Transformeerime andmed
        const transformedData = xteeClient.transformBuildingData(buildingData);

        // Lisame andmed andmebaasi
        for (const building of transformedData) {
          await client.query(
            `INSERT INTO ehr_buildings (
              piirkond, aadress, ehitusaasta, hoone_liik, 
              energiamark, materjal, korruseid, koordinaadid
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              building.piirkond,
              building.aadress,
              building.ehitusaasta,
              building.hoone_liik,
              building.energiamark,
              building.materjal,
              building.korruseid,
              building.koordinaadid
            ]
          );
        }

        console.log(`Linnaosa ${district} andmed imporditud`);
      }

      // Kinnitame transaktsiooni
      await client.query('COMMIT');
      console.log('Kõik andmed on edukalt imporditud andmebaasi');

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
importRealData(); 