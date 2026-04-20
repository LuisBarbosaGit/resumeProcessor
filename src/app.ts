import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { resumeRoutes } from "./modules/resume/routes.js";

export const buildApp = async () => {
  const app = Fastify();
  await app.register(cors, { origin: true });
  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 1,
    },
  });

  app.setValidatorCompiler(validatorCompiler);

  app.setSerializerCompiler(serializerCompiler);

  await app.register(resumeRoutes);

  return app.withTypeProvider<ZodTypeProvider>();
};
