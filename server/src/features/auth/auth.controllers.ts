import type { FastifyReply, FastifyRequest } from "fastify";

import jwt from "jsonwebtoken";
import { authenticator } from "otplib";

import { env } from "@/configs/env";
import { HTTPError } from "@/errors/http-error";
import { UnauthorizedError } from "@/errors/unauthorized-error";
import { sendSuccessResponse } from "@/utils/send-success-response";

import {
  authorizeUserDTO,
  changePasswordDTO,
  forgotPasswordDTO,
  registerUserDTO,
  resetPasswordDTO,
  twoFactorAuthenticationDTO,
  verifyUserDTO,
} from "./auth.dtos";
import {
  authorizeUser,
  changePassword,
  enableTwoFactorAuthentication,
  findUserById,
  logUserIn,
  logoutUser,
  registerUser,
  sendResetPasswordEmail,
  sendVerifyEmailLink,
  validateResetEmail,
  validateVerifyEmail,
  verifyPassword,
} from "./auth.services";

export async function registerUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = registerUserDTO.parse(request.body);
  const { userId, name, email } = await registerUser(body);

  sendVerifyEmailLink(body.email, userId);
  await logUserIn({ request, userId, name, email, reply });

  return sendSuccessResponse(reply, {
    message: "Registered User Successfully",
    status: 201,
    extra: { userId },
  });
}

export async function authorizeUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = authorizeUserDTO.parse(request.body);
  const {
    name,
    email,
    id: userId,
    authenticatorSecret,
  } = await authorizeUser(body);
  if (authenticatorSecret) {
    if (!body.token) throw new HTTPError("Token is required", 400);
    const isValid = authenticator.verify({
      token: body.token,
      secret: authenticatorSecret,
    });

    if (!isValid) throw new HTTPError("Invalid Token", 401);
  }

  await logUserIn({ request, userId, name, email, reply });

  return sendSuccessResponse(reply, {
    message: "Authorized User Successfully",
    extra: { userId },
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

    return sendSuccessResponse(reply, { message: "Logged Out Successfully" });
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

  return sendSuccessResponse(reply, {
    message: "Your email address has been verified",
  });
}

export async function getMeController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (!request.user) throw new UnauthorizedError();

  return sendSuccessResponse(reply, {
    message: `Hello ${request.user.name}`,
    extra: request.user,
  });
}

export async function changePasswordController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { newPassword, oldPassword } = changePasswordDTO.parse(request.body);

  if (newPassword === oldPassword)
    throw new HTTPError("New password can't be the same as old password", 400);

  if (!request.user) throw new UnauthorizedError();
  const { sessionToken, userId } = request.user;

  const currentUser = await findUserById(userId);
  if (!currentUser) throw new UnauthorizedError();

  if (!(await verifyPassword(oldPassword, currentUser.password)))
    throw new HTTPError("Old password is incorrect", 401);

  await changePassword(userId, newPassword, sessionToken);

  return sendSuccessResponse(reply, {
    message: "Password changed successfully",
  });
}

export async function forgotPasswordController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email } = forgotPasswordDTO.parse(request.body);

  await sendResetPasswordEmail(email);

  return sendSuccessResponse(reply, {
    message: "Please check your email to reset your password.",
  });
}

export async function resetPasswordController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { password, ...data } = resetPasswordDTO.parse(request.body);

  const userId = await validateResetEmail(data);
  await changePassword(userId, password);

  return sendSuccessResponse(reply, {
    message:
      "Password changed successfully! You can now login with your email address and new password.",
  });
}

export async function enableTwoFactorAuthenticationController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (!request.user) throw new UnauthorizedError();

  const body = twoFactorAuthenticationDTO.parse(request.body);
  await enableTwoFactorAuthentication({ ...body, userId: request.user.userId });

  sendSuccessResponse(reply, {
    message: "2fa Enabled Successfully",
  });
}
