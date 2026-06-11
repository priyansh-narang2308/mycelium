import type { z } from "zod";
import type { activityCategorySchema, activitySchema } from "@/lib/schemas/activity";
import type { recommendationSchema } from "@/lib/schemas/recommend";

export type ActivityCategory = z.infer<typeof activityCategorySchema>;
export type Activity = z.infer<typeof activitySchema>;
export type Recommendation = z.infer<typeof recommendationSchema>;

export interface Challenge {
  id: string;
  title: string;
  description: string;
  active: boolean;
  streak: number;
  completed: boolean;
}
