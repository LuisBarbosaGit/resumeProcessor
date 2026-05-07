import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../../resume/errors/AppError.js";
import { jobRepository } from "../repositories/jobRepository.js";
import { UpdateJobService } from "../services/updateJobService.js";
import type { JobParams, UpdateJobBody } from "../schema.js";

const repository = new jobRepository();
const updateJobService = new UpdateJobService(repository);

export const updateJobController = async (
  request: FastifyRequest<{ Params: JobParams; Body: UpdateJobBody }>,
  reply: FastifyReply,
) => {
  try {
    const job = await updateJobService.execute(request.params.id, request.body);

    return reply.code(200).send(job);
  } catch (error) {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }

    if (error instanceof Error) {
      return reply.code(400).send({ message: error.message });
    }

    return reply.code(500).send({ message: "Erro interno ao atualizar vaga" });
  }
};
