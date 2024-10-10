import type { FastifyReply, FastifyRequest } from "fastify";

import jwt from "jsonwebtoken";

import { STATUS } from "@/configs/constants";
import { env } from "@/configs/env";
import { UnauthorizedError } from "@/errors/unauthorized-error";

import { authorizeUserDTO, registerUserDTO, verifyUserDTO } from "./auth.dtos";
import {
  authorizeUser,
  createSession,
  logUserIn,
  logoutUser,
  registerUser,
  sendVerifyEmailLink,
  validateVerifyEmail,
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

  sendVerifyEmailLink(body.email, userId);
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
    if (!rawRefreshToken.valid || !rawRefreshToken.value) {
      reply.clearCookie("refreshToken");
      throw new UnauthorizedError();
    }

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

export async function verifyEmailController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (!request.user) throw new UnauthorizedError();
  const body = verifyUserDTO.parse(request.body);

  await validateVerifyEmail({ ...body, userId: request.user.userId });

  return reply.status(200).send({
    status: STATUS.SUCCESS,
    message: "Your email address has been verified",
  });
}

export async function getMeController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  return reply.status(200).send({ status: "SUCCESS", message: "Hello" });
}
