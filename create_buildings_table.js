import { pool } from './api/db.js';

async function createBuildingsTable() {
  try {
    // Loome tabeli
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ehr_buildings (
        id SERIAL PRIMARY KEY,
        piirkond VARCHAR(255) NOT NULL,
        aadress TEXT,
        ehitusaasta DATE,
        hoone_liik VARCHAR(50),
        energiamark INTEGER,
        materjal VARCHAR(50),
        korruseid INTEGER,
        koordinaadid POINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Lisame indeksid
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_ehr_buildings_piirkond ON ehr_buildings(piirkond);
      CREATE INDEX IF NOT EXISTS idx_ehr_buildings_hoone_liik ON ehr_buildings(hoone_liik);
      CREATE INDEX IF NOT EXISTS idx_ehr_buildings_materjal ON ehr_buildings(materjal);
    `);

    console.log('Tabel ehr_buildings loodud edukalt');
  } catch (error) {
    console.error('Viga tabeli loomisel:', error);
  } finally {
    await pool.end();
  }
}

createBuildingsTable(); 