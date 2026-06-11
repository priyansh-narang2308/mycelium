import { z } from "zod";

export const activitySchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  category: z.string(),
  subCategory: z.string(),
  amount: z.number(),
  unit: z.string(),
  co2e: z.number(),
  equivalent: z.string(),
  rawInput: z.string().optional(),
});
