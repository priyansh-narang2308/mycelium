import { z } from "zod";

export const parseInputSchema = z.object({
  input: z.string().min(1).max(500),
  region: z.string().optional(),
});

export const parseOutputSchema = z.object({
  category: z.enum(["transport", "food", "energy", "shopping"]),
  subCategory: z.string().min(1),
  amount: z.number().nonnegative(),
});
