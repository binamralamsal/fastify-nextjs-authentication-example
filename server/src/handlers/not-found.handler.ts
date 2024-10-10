import type { FastifyReply, FastifyRequest } from "fastify";

import { STATUS } from "@/configs/constants";

export function notFoundHandler(request: FastifyRequest, reply: FastifyReply) {
  reply.status(404).send({
    message: `Page that you are trying to access: ${request.url}; Not Found`,
    status: STATUS.NOT_FOUND,
  });
}
