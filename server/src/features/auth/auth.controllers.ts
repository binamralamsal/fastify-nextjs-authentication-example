import type { FastifyReply, FastifyRequest } from "fastify";

import jwt from "jsonwebtoken";

import { STATUS } from "@/configs/constants";
import { env } from "@/configs/env";
import { UnauthorizedError } from "@/errors/unauthorized-error";

import { authorizeUserDTO, registerUserDTO } from "./auth.dtos";
import {
  authorizeUser,
  createSession,
  logUserIn,
  logoutUser,
  registerUser,
} from "./auth.services";

export async function registerUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = registerUserDTO.parse(request.body);
  const { userId } = await registerUser(body);
  const { id: sessionId } = await createSession(userId, {
    ip: request.ip,
    userAgent: request.headers["user-agent"] || "",
  });

  logUserIn({ sessionId, userId }, reply);

  return reply.status(201).send({
    status: STATUS.SUCCESS,
    message: "Registered User Successfully",
    userId,
  });
}

export async function authorizeUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = authorizeUserDTO.parse(request.body);
  const userId = await authorizeUser(body);
  const { id: sessionId } = await createSession(userId, {
    ip: request.ip,
    userAgent: request.headers["user-agent"] || "",
  });

  logUserIn({ sessionId, userId }, reply);

  return reply.status(200).send({
    status: STATUS.SUCCESS,
    message: "Authorized User Successfully",
    userId,
  });
}

export async function logoutUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    if (!request.cookies.refreshToken) throw new UnauthorizedError();

    const rawRefreshToken = request.unsignCookie(request.cookies.refreshToken);
    if (!rawRefreshToken.valid || !rawRefreshToken.value)
      throw new UnauthorizedError();

    const refreshToken = jwt.verify(rawRefreshToken.value, env.JWT_SECRET);
    await logoutUser(refreshToken, reply);

    return reply.send({
      status: STATUS.SUCCESS,
      message: "Logged Out Successfully",
    });
  } catch {
    throw new UnauthorizedError();
  }
}
