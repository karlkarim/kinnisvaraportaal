// Skript: generateGeoRegions.js
// Laeb alla Eesti omavalitsuste GeoJSONi, arvutab keskpunktid ja ekspordib geoRegions.js

import fetch from 'node-fetch';
import * as turf from '@turf/turf';
import { writeFile } from 'fs/promises';
import { readFile } from 'fs/promises';

const GEOJSON_URL = 'https://raw.githubusercontent.com/buildig/EHAK/master/geojson/omavalitsused.json';
const LOCAL_FILE = './src/data/omavalitsused.json';
const OUTPUT_FILE = './src/data/geoRegions.js';

async function getGeojson() {
  try {
    console.log('Laen alla GeoJSONi...');
    const res = await fetch(GEOJSON_URL);
    if (!res.ok) throw new Error('GeoJSONi allalaadimine ebaõnnestus');
    return await res.json();
  } catch (e) {
    console.warn('Allalaadimine ebaõnnestus, proovin lugeda kohalikust failist:', LOCAL_FILE);
    const data = await readFile(LOCAL_FILE, 'utf8');
    return JSON.parse(data);
  }
}

async function main() {
  const geojson = await getGeojson();

  const regions = [];
  for (const feature of geojson.features) {
    // Omavalitsuse nimi
    const name = feature.properties.ONIMI;
    // Ainult omavalitsused (vald, linn)
    if (feature.properties.TYYP !== '1' && feature.properties.TYYP !== '4') continue;
    // Keskpunkt
    const centroid = turf.centroid(feature);
    const [lon, lat] = centroid.geometry.coordinates;
    regions.push({ name, center: [lat, lon] });
  }

  // Sort nime järgi
  regions.sort((a, b) => a.name.localeCompare(b.name, 'et'));

  // Ekspordi geoRegions.js
  const fileContent =
    'const geoRegions = ' + JSON.stringify(regions, null, 2) + ' \n\nexport default geoRegions;\n';
  await writeFile(OUTPUT_FILE, fileContent, 'utf8');
  console.log('geoRegions.js loodud:', OUTPUT_FILE);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}); 