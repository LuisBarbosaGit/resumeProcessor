import type { FastifyInstance } from "fastify";
import { createResumeController } from "./controllers/createResumeController.js";
import {
  createResumeInputSchema,
  createResumeResponseSchema,
} from "./schema.js";

export const resumeRoutes = async (app: FastifyInstance) => {
  app.post(
    "/resumes",
    {
      schema: {
        querystring: createResumeInputSchema,
        tags: ["resume"],
        summary: "Cria um resume com arquivo PDF",
        consumes: ["multipart/form-data"],
        response: {
          201: createResumeResponseSchema,
        },
      },
    },
    createResumeController,
  );
};
