const regionData = {
    name: "Mustamäe",
    center: [59.4058, 24.6975],
  
    priceHistory: [
      { quarter: "2023 Q1", pricePerM2: 2300 },
      { quarter: "2023 Q2", pricePerM2: 2400 },
      { quarter: "2023 Q3", pricePerM2: 2450 },
      { quarter: "2023 Q4", pricePerM2: 2500 },
      { quarter: "2024 Q1", pricePerM2: 2600 },
      { quarter: "2024 Q2", pricePerM2: 2700 }
    ],
  
    transactionCount: [
      { quarter: "2023 Q4", count: 84 },
      { quarter: "2024 Q1", count: 97 },
      { quarter: "2024 Q2", count: 103 }
    ],
  
    buildingTypes: {
      "Korterelamud": 65,
      "Eramajad": 25,
      "Suvilad": 5,
      "Muu": 5
    },
  
    buildings: {
      averageYear: 1980,
      dominantType: "Paneelmajad",
      energyClass: "D",
      totalBuildings: 1243
    }
  };
  
  export default regionData;
  