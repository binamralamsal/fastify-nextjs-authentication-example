import type { FastifyReply } from "fastify";

import crypto from "node:crypto";

import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import postgres from "postgres";

import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "@/configs/constants";
import { env } from "@/configs/env";
import { db } from "@/drizzle/db";
import { emailsTable, sessionsTable, usersTable } from "@/drizzle/schema";
import { HTTPError } from "@/errors/http-error";

import { refreshTokenDTO } from "./auth.dtos";

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
