import { z } from "zod";

export const emailDTO = z
  .string()
  .trim()
  .email({ message: "Invalid email address" });

export const passwordDTO = z
  .string()
  .min(8, { message: "Password must be of 8 characters long" });

export const nameDTO = z
  .string()
  .trim()
  .min(1, { message: "Name is required" });

export const authorizeUserDTO = z.object({
  email: emailDTO,
  password: passwordDTO,
  token: z
    .string()
    .trim()
    .min(6, { message: "Token must be of 6 digits" })
    .max(6, { message: "Token must be of 6 digits" })
    .optional(),
});

export const registerUserDTO = authorizeUserDTO.extend({ name: nameDTO });

export const refreshTokenDTO = z.object({
  sessionToken: z.string(),
});

export const accessTokenDTO = refreshTokenDTO.extend({
  userId: z.number(),
  name: z.string().min(1),
  email: z.string().email(),
});

export const verifyUserDTO = z.object({
  email: emailDTO,
  token: z.string().min(1, { message: "Token is required" }),
});

export const changePasswordDTO = z
  .object({
    oldPassword: z
      .string()
      .min(8, { message: "Old Password must be of 8 characters long" }),
    newPassword: z
      .string()
      .min(8, { message: "New Password must be of 8 characters long" }),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "Old Password can't be same as new password",
    path: ["newPassword"],
  });

export const forgotPasswordDTO = z.object({ email: emailDTO });

export const resetPasswordDTO = z.object({
  email: emailDTO,
  token: z.string().min(1, { message: "Token is required" }),
  password: passwordDTO,
  expiryTimeStamp: z.string().min(1, { message: "Time is required" }),
});

export const twoFactorAuthenticationDTO = z.object({
  token: z.string().min(1, { message: "Token is required" }),
  secret: z.string().min(1),
});
