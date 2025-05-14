import fs from 'fs';
import { faker } from '@faker-js/faker/locale/et';

// Tallinna linnaosad
const districts = [
  'Haabersti', 'Kesklinn', 'Kristiine', 'Lasnamäe', 'Mustamäe', 
  'Nõmme', 'Pirita', 'Põhja-Tallinn'
];

// Hoonete tüübid ja nende tõenäosused
const buildingTypes = [
  { type: 'Korterelamu', probability: 0.6 },
  { type: 'Eramu', probability: 0.3 },
  { type: 'Suvila', probability: 0.1 }
];

// Materjalid ja nende tõenäosused
const materials = [
  { material: 'Paneel', probability: 0.4 },
  { material: 'Telliskivi', probability: 0.3 },
  { material: 'Puit', probability: 0.2 },
  { material: 'Monoliit', probability: 0.1 }
];

// Funktsioon tõenäosuse põhjal valiku tegemiseks
function weightedRandom(items) {
  const random = Math.random();
  let sum = 0;
  for (const item of items) {
    sum += item.probability;
    if (random < sum) return item;
  }
  return items[items.length - 1];
}

// Funktsioon ehitusaasta genereerimiseks
function generateConstructionYear() {
  // 70% tõenäosusega 1960-1990, 30% tõenäosusega 1991-2024
  const year = Math.random() < 0.7
    ? faker.number.int({ min: 1960, max: 1990 })
    : faker.number.int({ min: 1991, max: 2024 });
  return new Date(year, 0, 1).toISOString().split('T')[0];
}

// Funktsioon energiamärgi genereerimiseks
function generateEnergyRating() {
  // Energetilise klassi tõenäosused
  const ratings = [
    { rating: 1, probability: 0.1 },  // E
    { rating: 2, probability: 0.2 },  // D
    { rating: 3, probability: 0.3 },  // C
    { rating: 4, probability: 0.25 }, // B
    { rating: 5, probability: 0.15 }  // A
  ];
  return weightedRandom(ratings).rating;
}

// Funktsioon korruste arvu genereerimiseks
function generateFloors(buildingType) {
  if (buildingType === 'Korterelamu') {
    return faker.number.int({ min: 2, max: 12 });
  } else if (buildingType === 'Eramu') {
    return faker.number.int({ min: 1, max: 3 });
  } else {
    return faker.number.int({ min: 1, max: 2 });
  }
}

// Funktsioon koordinaatide genereerimiseks
function generateCoordinates() {
  // Tallinna ligikaudsed koordinaatide piirid
  const lat = faker.number.float({ min: 59.3, max: 59.5, precision: 0.0001 });
  const lon = faker.number.float({ min: 24.6, max: 25.0, precision: 0.0001 });
  return `(${lat},${lon})`;
}

// Generaator andmete loomiseks
function generateTestData() {
  const buildings = [];
  const buildingsPerDistrict = 1000; // Iga linnaosa kohta 1000 hoonet

  for (const district of districts) {
    for (let i = 0; i < buildingsPerDistrict; i++) {
      const buildingType = weightedRandom(buildingTypes).type;
      const material = weightedRandom(materials).material;

      buildings.push({
        piirkond: district,
        aadress: faker.location.streetAddress(),
        ehitusaasta: generateConstructionYear(),
        hoone_liik: buildingType,
        energiamark: generateEnergyRating(),
        materjal: material,
        korruseid: generateFloors(buildingType),
        koordinaadid: generateCoordinates()
      });
    }
  }

  return buildings;
}

// Andmete genereerimine ja salvestamine
const testData = generateTestData();
const csvContent = [
  // CSV päis
  'piirkond,aadress,ehitusaasta,hoone_liik,energiamark,materjal,korruseid,koordinaadid',
  // Andmed
  ...testData.map(building => 
    Object.values(building).map(value => 
      typeof value === 'string' && value.includes(',') ? `"${value}"` : value
    ).join(',')
  )
].join('\n');

// Salvestame CSV faili
fs.writeFileSync('test_buildings_data.csv', csvContent, 'utf8');
console.log('Testandmed on genereeritud ja salvestatud faili test_buildings_data.csv'); 