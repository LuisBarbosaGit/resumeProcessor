import { queueConnection } from "./../connection.js";
import { Worker } from "bullmq";
import { PDFParse } from "pdf-parse";

export const resumeWorker = new Worker(
  "resume-processing",
  async (job) => {
    console.log("iniciando");
    const { resumeId, fileUrl } = job.data;

    const parser = new PDFParse({ url: fileUrl });

    const textFromPDF = await parser.getText();

    await parser.destroy();

    // 3. gerar embedding
    // 4. salvar no banco

    console.log("Finalizado:", textFromPDF);
  },
  {
    connection: queueConnection,
    concurrency: 1,
  },
);
