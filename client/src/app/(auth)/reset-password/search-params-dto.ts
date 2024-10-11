import { z } from "zod";

export const searchParamsSchema = z.object({
  token: z.string().min(1),
  email: z.string().trim().email().min(1),
});
