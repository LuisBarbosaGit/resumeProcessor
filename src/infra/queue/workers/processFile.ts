import { queueConnection } from "./../connection.js";
import { Worker } from "bullmq";

export const resumeWorker = new Worker(
  "resume-processing",
  async (job) => {
    const { resumeId, fileUrl } = job.data;

    console.log("Processando:", resumeId);

    // 1. baixar arquivo (S3/MinIO)
    // 2. extrair texto
    // 3. gerar embedding
    // 4. salvar no banco

    await new Promise((r) => setTimeout(r, 10000));

    console.log("Finalizado:", resumeId);
  },
  {
    connection: queueConnection,
    concurrency: 1,
  },
);
