import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";
import Fastify from "fastify";

import { env } from "@/configs/env";
import { authRoutes } from "@/features/auth/auth.routes";
import { errorHandler } from "@/handlers/error.handler";
import { notFoundHandler } from "@/handlers/not-found.handler";
import { logger } from "@/libs/pino";

const fastify = Fastify({
  loggerInstance: logger,
});

await fastify.register(cors, {
  credentials: true,
  origin: [`https://${env.FRONTEND_DOMAIN}`, "localhost"],
});

fastify.register(fastifyCookie, {
  secret: env.COOKIE_SIGNATURE,
  parseOptions: {
    httpOnly: true,
    secure: true,
    signed: true,
    domain: env.FRONTEND_DOMAIN,
    path: "/",
  },
});

fastify.setErrorHandler(errorHandler);
fastify.setNotFoundHandler(notFoundHandler);

await fastify.register(authRoutes, { prefix: "/api/auth" });

try {
  await fastify.listen({ port: env.PORT });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
