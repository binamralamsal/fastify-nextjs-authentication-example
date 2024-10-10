import type { FastifyReply } from "fastify";

import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import postgres from "postgres";

import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "@/configs/constants";
import { env } from "@/configs/env";
import { db } from "@/drizzle/db";
import { emailsTable, sessionsTable, usersTable } from "@/drizzle/schema";
import VerifyEmailLink from "@/emails/verify-email-link";
import { HTTPError } from "@/errors/http-error";
import { UnauthorizedError } from "@/errors/unauthorized-error";
import { logger } from "@/libs/pino";
import { sendEmail } from "@/libs/send-email";

import { accessTokenDTO, refreshTokenDTO } from "./auth.dtos";

const { PostgresError } = postgres;

export function hashPassword(password: string) {
  return Bun.password.hash(password);
}

export function verifyPassword(password: string, hashedPassword: string) {
  return Bun.password.verify(password, hashedPassword);
}

export async function registerUser(data: {
  email: string;
  name: string;
  password: string;
}) {
  const hashedPassword = await hashPassword(data.password);

  try {
    return await db.transaction(async (tx) => {
      const [{ userId }] = await tx
        .insert(usersTable)
        .values({
          name: data.name,
          password: hashedPassword,
        })
        .returning({ userId: usersTable.id });

      await tx.insert(emailsTable).values({
        userId: userId,
        email: data.email,
      });

      return { userId, name: data.name, email: data.email };
    });
  } catch (err) {
    if (err instanceof PostgresError && err.code === "23505") {
      throw new HTTPError("User with that Email address already exists", 409);
    }

    throw err;
  }
}

export async function createSession(
  userId: number,
  connection: { ip: string; userAgent: string },
) {
  const sessionToken = crypto.randomBytes(45).toString("hex");

  return (
    await db
      .insert(sessionsTable)
      .values({
        sessionToken,
        userId,
        userAgent: connection.userAgent,
        ip: connection.ip,
      })
      .returning()
  )[0];
}

export function logUserIn(
  { sessionId, userId }: { sessionId: number; userId: number },
  reply: FastifyReply,
) {
  const now = Math.floor(Date.now() / 1000);

  const accessToken = jwt.sign(
    {
      sessionId,
      userId,
      exp: now + ACCESS_TOKEN_EXPIRY,
    },
    env.JWT_SECRET,
  );
  const refreshToken = jwt.sign(
    { sessionId, exp: now + REFRESH_TOKEN_EXPIRY },
    env.JWT_SECRET,
  );

  reply.setCookie("accessToken", accessToken, { maxAge: ACCESS_TOKEN_EXPIRY });
  reply.setCookie("refreshToken", refreshToken, {
    maxAge: REFRESH_TOKEN_EXPIRY,
  });
}

export async function authorizeUser(data: { email: string; password: string }) {
  const [currentUser] = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      password: usersTable.password,
      email: emailsTable.email,
    })
    .from(usersTable)
    .innerJoin(emailsTable, eq(emailsTable.userId, usersTable.id))
    .where(eq(emailsTable.email, data.email))
    .limit(1);

  const errorMessage = "Invalid username or password";

  if (!currentUser) throw new HTTPError(errorMessage, 401);

  const isAuthorized = await verifyPassword(
    data.password,
    currentUser.password,
  );

  if (!isAuthorized) throw new HTTPError(errorMessage, 401);

  return currentUser.id;
}

export async function logoutUser(
  refreshToken: string | jwt.JwtPayload,
  reply: FastifyReply,
) {
  const validatedRefreshToken = refreshTokenDTO.parse(refreshToken);

  await db
    .delete(sessionsTable)
    .where(eq(sessionsTable.id, validatedRefreshToken.sessionId));
  reply.clearCookie("refreshToken");
  reply.clearCookie("accessToken");
}

export function sendVerifyEmailLink(email: string, userId: number) {
  const emailLink = createVerifyEmailLink(email, userId);
  sendEmail({
    from: "Auth Sample <binamralamsal@resend.dev>",
    to: [email],
    subject: "Verify your Email",
    react: VerifyEmailLink({ url: emailLink }),
  })
    .then(({ data, error }) => {
      if (data) return null;
      if (error) throw new Error(error.message);
    })
    .catch(logger.error);
}

export function createVerifyEmailToken(email: string, userId: number) {
  const authString = `${env.JWT_SECRET}:${email}:${userId}`;
  return crypto.createHash("sha256").update(authString).digest("hex");
}

export function createVerifyEmailLink(email: string, userId: number) {
  const emailToken = createVerifyEmailToken(email, userId);
  const uriEncodedEmail = encodeURIComponent(email);

  return `https://${env.FRONTEND_DOMAIN}/verify?token=${emailToken}&email=${uriEncodedEmail}`;
}

export async function validateVerifyEmail({
  email,
  userId,
  token,
}: {
  token: string;
  email: string;
  userId: number;
}) {
  const emailToken = createVerifyEmailToken(email, userId);
  const isValid = emailToken === token;

  if (!isValid) throw new HTTPError("Your verification link is invalid!", 400);

  await db
    .update(emailsTable)
    .set({ isVerified: true })
    .where(eq(emailsTable.userId, userId));
}

export function getUserFromAccessToken(accessToken: string) {
  try {
    const decodedAccessToken = jwt.verify(accessToken, env.JWT_SECRET);
    const validatedAccessToken = accessTokenDTO.parse(decodedAccessToken);

    return validatedAccessToken;
  } catch {
    throw new UnauthorizedError();
  }
}

export function findUserById(userId: number) {
  return db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
  });
}

export function findSessionById(sessionId: number) {
  return db.query.sessionsTable.findFirst({
    where: eq(sessionsTable.id, sessionId),
  });
}

export async function refreshTokens({
  refreshToken,
  reply,
}: {
  refreshToken: string;
  reply: FastifyReply;
}) {
  try {
    const decodedRefreshToken = jwt.verify(refreshToken, env.JWT_SECRET);

    const validatedRefreshToken = refreshTokenDTO.parse(decodedRefreshToken);
    const currentSession = await findSessionById(
      validatedRefreshToken.sessionId,
    );

    if (!currentSession?.valid) throw new UnauthorizedError();

    const user = await findUserById(currentSession.userId);
    if (!user) throw new UnauthorizedError();

    logUserIn(
      {
        sessionId: currentSession.id,
        userId: user.id,
      },
      reply,
    );

    return { userId: user.id, sessionId: currentSession.id };
  } catch {
    throw new UnauthorizedError();
  }
}
