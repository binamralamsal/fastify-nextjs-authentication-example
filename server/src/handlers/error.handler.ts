import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";

import { ZodError } from "zod";

import { STATUS } from "@/configs/constants";
import { HTTPError } from "@/errors/http-error";

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  console.error(error);
  if (error instanceof ZodError) {
    return reply.status(422).send({
      error,
      message: error.issues[0].message,
      status: STATUS.VALIDATION_ERROR,
    });
  }

  if (error instanceof HTTPError) {
    return reply
      .status(error.statusCode)
      .send({ message: error.message, status: STATUS.ERROR });
  }

  request.log.error(error);
  reply.status(500).send({ message: error.message, status: STATUS.ERROR });
}
