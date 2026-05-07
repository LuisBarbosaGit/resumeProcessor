import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../../resume/errors/AppError.js";
import { jobRepository } from "../repositories/jobRepository.js";
import { CreateJobService } from "../services/createJobService.js";
import type { CreateJobBody } from "../schema.js";

const repository = new jobRepository();
const createJobService = new CreateJobService(repository);

export const createJobController = async (
  request: FastifyRequest<{ Body: CreateJobBody }>,
  reply: FastifyReply,
) => {
  try {
    const job = await createJobService.execute(request.body);

    return reply.code(201).send(job);
  } catch (error) {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }

    if (error instanceof Error) {
      return reply.code(400).send({ message: error.message });
    }

    return reply.code(500).send({ message: "Erro interno ao criar vaga" });
  }
};
