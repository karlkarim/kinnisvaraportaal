const regionList = [
    {
      name: "Mustamäe",
      center: [59.4058, 24.6975],
      priceHistory: [
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
        totalBuildings: 1243,
        averageYear: 1980,
        dominantType: "Paneelmajad",
        energyClass: "D"
      }
    },
    {
      name: "Lasnamäe",
      center: [59.437, 24.851],
      priceHistory: [
        { quarter: "2023 Q4", pricePerM2: 2200 },
        { quarter: "2024 Q1", pricePerM2: 2300 },
        { quarter: "2024 Q2", pricePerM2: 2350 }
      ],
      transactionCount: [
        { quarter: "2023 Q4", count: 115 },
        { quarter: "2024 Q1", count: 122 },
        { quarter: "2024 Q2", count: 130 }
      ],
      buildingTypes: {
        "Korterelamud": 75,
        "Eramajad": 10,
        "Suvilad": 3,
        "Muu": 12
      },
      buildings: {
        totalBuildings: 1804,
        averageYear: 1985,
        dominantType: "Suured korterelamud",
        energyClass: "C"
      }
    }
  ];
  
  export default regionList;
  