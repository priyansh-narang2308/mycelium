import { z } from "zod";
import { activityCategorySchema } from "./activity";

export const parseInputSchema = z.object({
  input: z.string().min(1).max(500),
  region: z.string().optional(),
});

export const parseOutputSchema = z.object({
  category: activityCategorySchema,
  subCategory: z.string().min(1),
  amount: z.number().nonnegative(),
});
