import { z } from "zod";
import { activitySchema } from "./activity";

export const insightSchema = z.object({
  history: z.array(activitySchema),
  budget: z.number().positive(),
  region: z.string().optional(),
});
