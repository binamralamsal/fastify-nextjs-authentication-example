import { z } from "zod";

export const authorizeUserDTO = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be of 8 characters long" }),
});

export const registerUserDTO = authorizeUserDTO.extend({
  name: z.string().trim().min(1, { message: "Name is required" }),
});

export const refreshTokenDTO = z.object({
  sessionId: z.number(),
});

export const accessTokenDTO = refreshTokenDTO.extend({
  userId: z.number(),
});

export const verifyUserDTO = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  token: z.string().min(1, { message: "Token is required" }),
});

export const changePasswordDTO = z.object({
  oldPassword: z
    .string()
    .min(8, { message: "Old Password must be of 8 characters long" }),
  newPassword: z
    .string()
    .min(8, { message: "New Password must be of 8 characters long" }),
});
