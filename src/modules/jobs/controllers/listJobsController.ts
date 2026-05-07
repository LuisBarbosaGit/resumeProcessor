import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../../resume/errors/AppError.js";
import { jobRepository } from "../repositories/jobRepository.js";
import { ListJobsService } from "../services/listJobsService.js";

const repository = new jobRepository();
const listJobsService = new ListJobsService(repository);

export const listJobsController = async (
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const jobsList = await listJobsService.execute();

    return reply.code(200).send(jobsList);
  } catch (error) {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }

    if (error instanceof Error) {
      return reply.code(400).send({ message: error.message });
    }

    return reply.code(500).send({ message: "Erro interno ao listar vagas" });
  }
};
