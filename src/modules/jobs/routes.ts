import type { FastifyInstance } from "fastify";
import { createJobController } from "./controllers/createJobController.js";
import { deleteJobController } from "./controllers/deleteJobController.js";
import { getJobController } from "./controllers/getJobController.js";
import { listJobsController } from "./controllers/listJobsController.js";
import { updateJobController } from "./controllers/updateJobController.js";
import {
  createJobBodySchema,
  jobParamsSchema,
  jobResponseSchema,
  jobsListResponseSchema,
  updateJobBodySchema,
} from "./schema.js";

export const jobRoutes = async (app: FastifyInstance) => {
  app.post(
    "/jobs",
    {
      schema: {
        tags: ["jobs"],
        summary: "Cria uma vaga",
        body: createJobBodySchema,
        response: {
          201: jobResponseSchema,
        },
      },
    },
    createJobController,
  );

  app.get(
    "/jobs",
    {
      schema: {
        tags: ["jobs"],
        summary: "Lista vagas",
        response: {
          200: jobsListResponseSchema,
        },
      },
    },
    listJobsController,
  );

  app.get(
    "/jobs/:id",
    {
      schema: {
        tags: ["jobs"],
        summary: "Busca vaga por id",
        params: jobParamsSchema,
        response: {
          200: jobResponseSchema,
        },
      },
    },
    getJobController,
  );

  app.patch(
    "/jobs/:id",
    {
      schema: {
        tags: ["jobs"],
        summary: "Atualiza uma vaga",
        params: jobParamsSchema,
        body: updateJobBodySchema,
        response: {
          200: jobResponseSchema,
        },
      },
    },
    updateJobController,
  );

  app.delete(
    "/jobs/:id",
    {
      schema: {
        tags: ["jobs"],
        summary: "Remove uma vaga",
        params: jobParamsSchema,
        response: {
          204: { type: "null", description: "Sem conteudo" },
        },
      },
    },
    deleteJobController,
  );
};
