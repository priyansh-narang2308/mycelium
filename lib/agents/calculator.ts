import { calculateEmissions, EMISSION_FACTORS } from "@/lib/emissions";
import { getEquivalent } from "@/lib/equivalents";
import { activityCategorySchema } from "@/lib/schemas/activity";
import type { Activity, ActivityCategory } from "@/lib/types";

function toActivityCategory(category: string): ActivityCategory {
  const result = activityCategorySchema.safeParse(category);
  return result.success ? result.data : "transport";
}

export function calculateActivityEmissions(
  category: string,
  subCategory: string,
  amount: number,
  rawInput?: string,
  region?: string,
): Omit<Activity, "id" | "timestamp"> {
  const normalizedCategory = toActivityCategory(category);
  const co2e = calculateEmissions(normalizedCategory, subCategory, amount, region);
  const equivalent = getEquivalent(co2e);

  const unit =
    EMISSION_FACTORS[normalizedCategory]?.[subCategory]?.unit || "unknown";

  return {
    category: normalizedCategory,
    subCategory,
    amount,
    unit,
    co2e,
    equivalent,
    rawInput,
  };
}
