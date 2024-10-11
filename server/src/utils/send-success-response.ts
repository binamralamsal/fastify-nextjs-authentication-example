import type { FastifyReply } from "fastify";

import { STATUS } from "@/configs/constants";

interface SuccessResponseOptions {
  message: string;
  status?: number;
  extra?: Record<string, unknown>;
}

export function sendSuccessResponse(
  reply: FastifyReply,
  { message, status = 200, extra = {} }: SuccessResponseOptions,
) {
  return reply.status(status).send({
    status: STATUS.SUCCESS,
    message,
    ...extra,
  });
}
