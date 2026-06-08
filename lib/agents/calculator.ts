import { calculateEmissions, EMISSION_FACTORS } from "../emissions";
import { getEquivalent } from "../equivalents";
import { Activity } from "../types";

export function calculateActivityEmissions(
  category: string,
  subCategory: string,
  amount: number,
  rawInput?: string,
  region?: string,
): Omit<Activity, "id" | "timestamp"> {
  const co2e = calculateEmissions(category, subCategory, amount, region);
  const equivalent = getEquivalent(co2e);

  const factors = EMISSION_FACTORS as Record<
    string,
    Record<string, { unit: string }>
  >;
  const unit = factors[category]?.[subCategory]?.unit || "unknown";

  return {
    category,
    subCategory,
    amount,
    unit,
    co2e,
    equivalent,
    rawInput,
  };
}
