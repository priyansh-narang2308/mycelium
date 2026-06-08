type FactorEntry = { value: number; unit: string; description: string };
type EmissionFactors = {
  [C: string]: { [S: string]: FactorEntry };
};

export const EMISSION_FACTORS = {
  transport: {
    car: { value: 0.17, unit: "km", description: "Average gasoline car" },
    flight: { value: 0.255, unit: "km", description: "Short-haul flight" },
    bus: { value: 0.08, unit: "km", description: "Local public bus" },
    train: { value: 0.04, unit: "km", description: "National rail" },
    bike: { value: 0, unit: "km", description: "Bicycle or walking" },
  },
  food: {
    beef: { value: 27, unit: "kg", description: "Beef herd" },
    chicken: { value: 6.9, unit: "kg", description: "Poultry meat" },
    pork: { value: 7.9, unit: "kg", description: "Pig meat" },
    vegetables: { value: 2.0, unit: "kg", description: "Root vegetables" },
    rice: { value: 4.1, unit: "kg", description: "Rice" },
  },
  energy: {
    grid_avg: {
      value: 0.4,
      unit: "kWh",
      description: "Average grid electricity",
    },
    solar: { value: 0.05, unit: "kWh", description: "Residential solar" },
  },
  shopping: {
    new_laptop: {
      value: 230,
      unit: "item",
      description: "New laptop computer",
    },
    tshirt: { value: 5, unit: "item", description: "Cotton t-shirt" },
    jeans: { value: 20, unit: "item", description: "Denim jeans" },
  },
} satisfies EmissionFactors;

export type EmissionCategory = keyof typeof EMISSION_FACTORS;
export type EmissionSubCategory<C extends EmissionCategory> = keyof (typeof EMISSION_FACTORS)[C];

export function calculateEmissions(
  category: string,
  subCategory: string,
  amount: number,
): number {
  const factors = EMISSION_FACTORS as EmissionFactors;
  const factor = factors[category]?.[subCategory]?.value;
  if (factor === undefined) return 0;
  return factor * amount;
}
