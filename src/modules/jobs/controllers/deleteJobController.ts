import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../../resume/errors/AppError.js";
import { jobRepository } from "../repositories/jobRepository.js";
import { DeleteJobService } from "../services/deleteJobService.js";
import type { JobParams } from "../schema.js";

const repository = new jobRepository();
const deleteJobService = new DeleteJobService(repository);

export const deleteJobController = async (
  request: FastifyRequest<{ Params: JobParams }>,
  reply: FastifyReply,
) => {
  try {
    await deleteJobService.execute(request.params.id);

    return reply.code(204).send();
  } catch (error) {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }

    if (error instanceof Error) {
      return reply.code(400).send({ message: error.message });
    }

    return reply.code(500).send({ message: "Erro interno ao excluir vaga" });
  }
};
