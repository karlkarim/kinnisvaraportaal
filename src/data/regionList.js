const regionList = [
  {
    name: "Mustamäe",
    center: [59.4058, 24.6975],
    priceHistory: [
      { quarter: "2023 Q4", pricePerM2: 2500 },
      { quarter: "2024 Q1", pricePerM2: 2600 }
    ],
    transactionCount: [
      { quarter: "2023 Q4", count: 84 },
      { quarter: "2024 Q1", count: 97 }
    ],
    buildingTypes: {
      Korterelamud: 65,
      Eramajad: 25
    },
    buildings: {
      totalBuildings: 1243,
      averageYear: 1980,
      dominantType: "Paneelmajad",
      energyClass: "D"
    }
  }
];

export default regionList;