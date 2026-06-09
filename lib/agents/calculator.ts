import { calculateEmissions, EMISSION_FACTORS } from "@/lib/emissions";
import { getEquivalent } from "@/lib/equivalents";
import { Activity } from "@/lib/types";

/**
 * Calculates emissions for an activity and returns a complete activity object minus id/timestamp.
 * @param category - Emission category (transport, food, energy, shopping)
 * @param subCategory - Specific activity type within category
 * @param amount - Quantity of the activity
 * @param rawInput - Original user input for reference
 * @param region - Optional region for grid-adjusted electricity calculations
 * @returns Activity object with emissions, equivalent, and metadata
 */
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
