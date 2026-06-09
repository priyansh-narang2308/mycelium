import { z } from "zod";

export const parseInputSchema = z.object({
  input: z.string().min(1).max(500),
  region: z.string().optional(),
});

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

export const recommendSchema = z.object({
  history: z.array(activitySchema),
  region: z.string().optional(),
});

export const insightSchema = z.object({
  history: z.array(activitySchema),
  budget: z.number().positive(),
  region: z.string().optional(),
});

export const parseOutputSchema = z.object({
  category: z.enum(["transport", "food", "energy", "shopping"]),
  subCategory: z.string().min(1),
  amount: z.number().nonnegative(),
});

export const recommendationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  potentialSavings: z.number().nonnegative().max(10000),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
});

export const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z.array(activitySchema),
});
