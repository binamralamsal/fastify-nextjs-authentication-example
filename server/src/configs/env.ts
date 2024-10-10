import { z } from "zod";

export const env = z
  .object({
    PORT: z.coerce.number().default(3001),
    DATABASE_URL: z.string(),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    LOG_LEVEL: z
      .enum(["debug", "error", "fatal", "info", "silent", "trace", "warn"])
      .default("info"),
    JWT_SECRET: z.string(),
    COOKIE_SIGNATURE: z.string(),
    FRONTEND_DOMAIN: z.string(),
  })
  .parse(process.env);
