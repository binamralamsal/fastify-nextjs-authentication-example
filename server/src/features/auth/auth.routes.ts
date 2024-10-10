import type { FastifyInstance } from "fastify";

import * as authControllers from "./auth.controllers";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/register", authControllers.registerUserController);
  fastify.post("/authorize", authControllers.authorizeUserController);
  fastify.post("/logout", authControllers.logoutUserController);
}
