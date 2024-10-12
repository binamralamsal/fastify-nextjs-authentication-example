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

  fastify.get(
    "/profile",
    { preHandler: authMiddleware },
    authControllers.profileController,
  );

  fastify.post(
    "/change-password",
    { preHandler: authMiddleware },
    authControllers.changePasswordController,
  );

  fastify.post("/forgot-password", authControllers.forgotPasswordController);
  fastify.post("/reset-password", authControllers.resetPasswordController);

  fastify.post(
    "/enable-2fa",
    { preHandler: authMiddleware },
    authControllers.enableTwoFactorAuthenticationController,
  );

  fastify.post(
    "/disable-2fa",
    { preHandler: authMiddleware },
    authControllers.disableTwoFactorAuthenticationController,
  );

  fastify.post(
    "/regenerate-backup-codes",
    { preHandler: authMiddleware },
    authControllers.regenerateBackupCodesController,
  );
}
