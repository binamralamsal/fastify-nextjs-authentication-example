import type { FastifyInstance } from "fastify";

import { authMiddleware } from "@/middlewares/auth.middleware";

import * as authControllers from "./auth.controllers";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/register", authControllers.registerUserController);
  fastify.post("/authorize", authControllers.authorizeUserController);
  fastify.post("/logout", authControllers.logoutUserController);

  fastify.post(
    "/verify",
    { preHandler: authMiddleware },
    authControllers.verifyEmailController,
  );

  fastify.get(
    "/me",
    { preHandler: authMiddleware },
    authControllers.getMeController,
  );

  fastify.post(
    "/change-password",
    { preHandler: authMiddleware },
    authControllers.changePasswordController,
  );
}
