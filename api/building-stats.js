import express from 'express';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const router = express.Router();

router.get('/building-stats', async (req, res) => {
  try {
    const { region } = req.query;

    if (!region) {
      return res.status(400).json({ error: 'Piirkond on kohustuslik' });
    }

    // Päring hoonestuse statistika jaoks
    const query = `
      SELECT 
        ROUND(AVG(EXTRACT(YEAR FROM ehitusaasta))) as avg_construction_year,
        COUNT(*) FILTER (WHERE hoone_liik = 'Korterelamu') as apartment_count,
        COUNT(*) FILTER (WHERE hoone_liik = 'Eramu') as house_count,
        COUNT(*) FILTER (WHERE hoone_liik = 'Suvila') as summer_house_count,
        ROUND(AVG(energiamark)) as avg_energy_rating,
        COUNT(*) FILTER (WHERE materjal = 'Paneel') as panel_count,
        COUNT(*) FILTER (WHERE materjal = 'Telliskivi') as brick_count,
        COUNT(*) FILTER (WHERE materjal = 'Puit') as wood_count,
        COUNT(*) FILTER (WHERE materjal = 'Monoliit') as monolithic_count
      FROM ehr_buildings
      WHERE piirkond = $1
    `;

    const result = await pool.query(query, [region]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Andmeid ei leitud' });
    }

    const stats = result.rows[0];

    // Arvutame protsendid materjalide jaoks
    const totalBuildings = stats.panel_count + stats.brick_count + stats.wood_count + stats.monolithic_count;
    
    const buildingStats = {
      avg_construction_year: Math.round(stats.avg_construction_year) || 'Andmed puuduvad',
      building_types: {
        apartments: stats.apartment_count,
        houses: stats.house_count,
        summer_houses: stats.summer_house_count
      },
      energy_rating: stats.avg_energy_rating ? `E${Math.round(stats.avg_energy_rating)}` : 'Andmed puuduvad',
      materials: {
        panel: totalBuildings ? Math.round((stats.panel_count / totalBuildings) * 100) : 0,
        brick: totalBuildings ? Math.round((stats.brick_count / totalBuildings) * 100) : 0,
        wood: totalBuildings ? Math.round((stats.wood_count / totalBuildings) * 100) : 0,
        monolithic: totalBuildings ? Math.round((stats.monolithic_count / totalBuildings) * 100) : 0
      }
    };

    res.json(buildingStats);
  } catch (error) {
    console.error('Viga hoonestuse statistika pärimisel:', error);
    res.status(500).json({ error: 'Serveri viga' });
  }
});

export default router; 