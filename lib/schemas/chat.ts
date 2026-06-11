import { z } from "zod";
import { activitySchema } from "./activity";

export const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z.array(activitySchema),
});
