import { calculateEmissions, EMISSION_FACTORS } from "@/lib/emissions";
import { getEquivalent } from "@/lib/equivalents";
import { Activity } from "@/lib/types";

export function calculateActivityEmissions(
  category: string,
  subCategory: string,
  amount: number,
  rawInput?: string,
  region?: string,
): Omit<Activity, "id" | "timestamp"> {
  const co2e = calculateEmissions(category, subCategory, amount, region);
  const equivalent = getEquivalent(co2e);

  const unit = EMISSION_FACTORS[category]?.[subCategory]?.unit || "unknown";

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
