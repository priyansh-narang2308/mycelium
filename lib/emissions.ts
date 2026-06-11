import {
  EMISSION_FACTORS,
  REGION_GRID_FACTORS,
  DEFAULT_REGION,
  GRID_AVERAGE_KG_PER_KWH,
  EMISSION_FACTOR_SOURCE,
} from "./data/emissions-factors";

export {
  EMISSION_FACTORS,
  REGION_GRID_FACTORS,
  DEFAULT_REGION,
  GRID_AVERAGE_KG_PER_KWH,
  EMISSION_FACTOR_SOURCE,
};


function getRegionFactor(region: string): number {
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
