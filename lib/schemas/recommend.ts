import { z } from "zod";
import { activitySchema } from "./activity";

export const recommendSchema = z.object({
  history: z.array(activitySchema),
  region: z.string().optional(),
});

export const recommendationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  potentialSavings: z.number().nonnegative().max(10000),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
});
