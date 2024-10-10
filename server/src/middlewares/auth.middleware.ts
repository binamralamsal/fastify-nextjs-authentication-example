import type {
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from "fastify";

import { UnauthorizedError } from "@/errors/unauthorized-error";
import {
  getUserFromAccessToken,
  refreshTokens,
} from "@/features/auth/auth.services";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction,
) {
  const { accessToken, refreshToken } = request.cookies;

  function handleInvalidToken(token: string, type: "access" | "refresh") {
    reply.clearCookie(`${type}Token`);
    throw new UnauthorizedError();
  }

  try {
    if (accessToken) {
      const { valid, value } = request.unsignCookie(accessToken);
      if (!valid || !value) return handleInvalidToken(accessToken, "access");

      request.user = getUserFromAccessToken(value);
      return done();
    }

    if (!refreshToken) throw new UnauthorizedError();

    const { valid, value } = request.unsignCookie(refreshToken);
    if (!valid || !value) return handleInvalidToken(refreshToken, "refresh");

    request.user = await refreshTokens({ refreshToken: value, reply });
    done();
  } catch {
    throw new UnauthorizedError();
  }
}
