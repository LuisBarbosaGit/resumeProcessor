import type { FastifyReply, FastifyRequest } from "fastify";
import { CreateResumeService } from "../services/createResumeService.js";
import { resumeRepository } from "../repository/resumeRepository.js";

const repository = new resumeRepository();
const createResumeService = new CreateResumeService(repository);

export const createResumeController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const file = await request.file();

  if (!file) {
    return reply.code(400).send({
      message: "Arquivo PDF e obrigatorio",
    });
  }
  const { email } = request.query as { email: string };

  try {
    const resume = await createResumeService.execute({
      email,
      file,
    });

    return reply.code(201).send(resume);
  } catch (error) {
    if (error instanceof Error) {
      return reply.code(400).send({
        message: error.message,
      });
    }

    return reply.code(500).send({
      message: "Erro interno ao processar arquivo",
    });
  }
};
