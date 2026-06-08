type FactorEntry = { value: number; unit: string; description: string };
type EmissionFactorMap = Record<string, Record<string, FactorEntry>>;

export const EMISSION_FACTORS: EmissionFactorMap = {
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
};

// Grid carbon intensity by region (kg CO₂e per kWh)
// Compared to the default global average of 0.40
export const REGION_GRID_FACTORS: Record<string, { label: string; factor: number }> = {
  global: { label: "Global Average", factor: 1.0 },
  "us-east": { label: "US (Eastern Grid)", factor: 0.85 },
  "us-west": { label: "US (Western Grid)", factor: 0.65 },
  "us-ercot": { label: "US (Texas / ERCOT)", factor: 1.1 },
  "us-caiso": { label: "US (California / CAISO)", factor: 0.5 },
  europe: { label: "Europe (EU Average)", factor: 0.6 },
  france: { label: "France", factor: 0.15 },
  germany: { label: "Germany", factor: 0.85 },
  uk: { label: "United Kingdom", factor: 0.55 },
  india: { label: "India", factor: 1.75 },
  china: { label: "China", factor: 1.5 },
  australia: { label: "Australia", factor: 1.25 },
  canada: { label: "Canada", factor: 0.3 },
  japan: { label: "Japan", factor: 1.1 },
  brazil: { label: "Brazil", factor: 0.25 },
};

export const DEFAULT_REGION = "global";

export function getRegionFactor(region: string): number {
  return REGION_GRID_FACTORS[region]?.factor ?? 1.0;
}

export function calculateEmissions(
  category: string,
  subCategory: string,
  amount: number,
  region?: string,
): number {
  const factor = EMISSION_FACTORS[category]?.[subCategory]?.value;
  if (factor === undefined) return 0;

  let adjusted = factor * amount;

  if (category === "energy" && subCategory === "grid_avg" && region) {
    adjusted *= getRegionFactor(region);
  }

  return adjusted;
}

export function getRegionLabel(region: string): string {
  return REGION_GRID_FACTORS[region]?.label ?? "Global Average";
}
