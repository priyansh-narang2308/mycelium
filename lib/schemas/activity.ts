import { z } from "zod";

export const activityCategorySchema = z.enum([
  "transport",
  "food",
  "energy",
  "shopping",
]);

export const activitySchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  category: activityCategorySchema,
  subCategory: z.string().min(1),
  amount: z.number(),
  unit: z.string(),
  co2e: z.number(),
  equivalent: z.string(),
  rawInput: z.string().optional(),
});
