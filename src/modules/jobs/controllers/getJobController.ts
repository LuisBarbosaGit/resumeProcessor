import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../../resume/errors/AppError.js";
import { jobRepository } from "../repositories/jobRepository.js";
import { GetJobService } from "../services/getJobService.js";
import type { JobParams } from "../schema.js";

const repository = new jobRepository();
const getJobService = new GetJobService(repository);

export const getJobController = async (
  request: FastifyRequest<{ Params: JobParams }>,
  reply: FastifyReply,
) => {
  try {
    const job = await getJobService.execute(request.params.id);

    return reply.code(200).send(job);
  } catch (error) {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }

    if (error instanceof Error) {
      return reply.code(400).send({ message: error.message });
    }

    return reply.code(500).send({ message: "Erro interno ao buscar vaga" });
  }
};
