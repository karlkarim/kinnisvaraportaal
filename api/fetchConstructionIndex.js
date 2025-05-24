import fetch from 'node-fetch';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Statistikaameti API päringufunktsioon
async function fetchConstructionIndexFromStat() {
  try {
    const years = [
      "2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012",
      "2013","2014","2015","2016","2017","2018","2019","2020","2021","2022","2023","2024"
    ];
    const requestBody = {
      query: [
        {
          code: 'Aasta',
          selection: {
            filter: 'item',
            values: years
          }
        },
        {
          code: 'Kvartal',
          selection: {
            filter: 'item',
            values: ['I','II','III','IV']
          }
        },
        {
          code: 'Ressursigrupp',
          selection: {
            filter: 'item',
            values: ['1']
          }
        },
        {
          code: 'Ehituse liik',
          selection: {
            filter: 'item',
            values: ['1']
          }
        }
      ],
      response: {
        format: 'json'
      }
    };

    console.log('Saadetav päring:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://andmed.stat.ee/api/v1/et/stat/IA10', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Statistikaameti API päring tehtud, status:', response.status);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Statistikaameti API viga:', response.status, text);
      throw new Error(`Statistikaameti API viga: ${response.status} - ${text}`);
    }

    const data = await response.json();
    console.log('Statistikaameti API vastus:', JSON.stringify(data, null, 2));
    console.log('Statistikaameti API vastuses ridu:', data.data ? data.data.length : 0);

    // Kontrolli, kas andmed on juba olemas
    const existing = await pool.query('SELECT year, quarter FROM construction_index');
    console.log('Olemasolevad andmed:', existing.rows);

    // Kogu kõik väärtused massiivi
    if (!data.data || !Array.isArray(data.data)) {
      console.error('API vastuse struktuur:', data);
      throw new Error('Statistikaameti API ootamatu struktuur: data.data puudub või pole massiiv');
    }

    const inserts = [];
    for (const row of data.data) {
      if (!row.key || !row.values) {
        console.error('Vigane rida:', row);
        continue;
      }
      // row.key: [year, ..., ..., quarter]
      const year = row.key[0];
      const quarter = row.key[3]; // rooma number kvartal
      const value = row.values[0];
      if (year && quarter && value !== undefined) {
        inserts.push([year, quarter, value]);
      }
    }

    console.log('Valmistatud andmed salvestamiseks:', inserts.length);

    if (inserts.length > 0) {
      const valuesSql = inserts.map((_, i) => `($${i*3+1}, $${i*3+2}, $${i*3+3})`).join(',');
      const flat = inserts.flat();
      try {
        await pool.query(
          `INSERT INTO construction_index (year, quarter, index_value) VALUES ${valuesSql}
           ON CONFLICT (year, quarter) DO NOTHING`, 
          flat
        );
        console.log('Andmed salvestatud andmebaasi');
      } catch (dbError) {
        console.error('Andmebaasi viga:', dbError);
        throw new Error(`Andmebaasi viga: ${dbError.message}`);
      }
    } else {
      console.log('Ei leitud andmeid salvestamiseks');
    }
  } catch (error) {
    console.error('Viga fetchConstructionIndexFromStat funktsioonis:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  console.log(">>> Construction Index endpoint called");
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Proovi kõigepealt andmebaasist lugeda
    const existingData = await pool.query('SELECT year, quarter, index_value FROM construction_index ORDER BY year DESC, quarter DESC');
    console.log('Andmebaasist leitud read:', existingData.rows.length);
    
    if (existingData.rows.length === 0) {
      console.log('Andmebaasis pole andmeid, proovin Statistikaametist laadida');
      await fetchConstructionIndexFromStat();
      const result = await pool.query('SELECT year, quarter, index_value FROM construction_index ORDER BY year DESC, quarter DESC');
      return res.status(200).json(result.rows);
    }
    
    return res.status(200).json(existingData.rows);
  } catch (err) {
    console.error('Error in Construction Index handler:', err);
    return res.status(500).json({ error: err.message });
  }
} 