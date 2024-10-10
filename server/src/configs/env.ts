import { z } from "zod";

export const env = z
  .object({
    PORT: z.coerce.number().default(3001),
    DATABASE_URL: z.string().min(1),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    LOG_LEVEL: z
      .enum(["debug", "error", "fatal", "info", "silent", "trace", "warn"])
      .default("info"),
    JWT_SECRET: z.string().min(1),
    COOKIE_SIGNATURE: z.string().min(1),
    FRONTEND_DOMAIN: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
  })
  .parse(process.env);
