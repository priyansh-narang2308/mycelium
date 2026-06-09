export const GRID_AVERAGE_KG_PER_KWH = 0.4;

export const EMISSION_FACTOR_SOURCE = {
  TRANSPORT: "UK DEFRA 2024",
  FOOD: "Poore & Nemecek 2018",
  ENERGY: "UK DEFRA 2024",
  SHOPPING: "UK DEFRA 2024",
} as const;

export const CO2_EQUIVALENTS = [
  { threshold: 0.01, text: "charging a smartphone", value: 0.008 },
  { threshold: 0.5, text: "boiling a kettle", value: 0.015 },
  { threshold: 2.0, text: "a load of laundry", value: 0.6 },
  { threshold: 10.0, text: "a gallon of gas consumed", value: 8.88 },
  { threshold: 50.0, text: "a tree grown for 10 years", value: 21.0 },
  { threshold: 200.0, text: "a flight from NY to LA", value: 150.0 },
] as const;