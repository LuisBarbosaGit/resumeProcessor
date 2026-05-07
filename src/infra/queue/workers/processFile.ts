import { queueConnection } from "./../connection.js";
import { Worker } from "bullmq";
import { PDFParse } from "pdf-parse";
import { client } from "../../agent/client.js";
import { db } from "../../db/client.js";
import { jobs, resumes } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { zodTextFormat } from "openai/helpers/zod.js";
import { AgentResponseSchema } from "../../../domain/schemas/agentResponseSchema.js";

export const resumeWorker = new Worker(
  "resume-processing",
  async (job) => {
    console.log("iniciando");
    const { resumeId, fileUrl, jobId } = job.data;

    const parser = new PDFParse({ url: fileUrl });

    const textFromPDF = await parser.getText();

    await parser.destroy();

    const [jobInfo] = await db.select().from(jobs).where(eq(jobs.id, jobId));

    const resumeProcessed = await client.responses.parse({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "Você é um especialista em processamento de currículos. Seu objetivo é analisar o currículo do candidato e extrair as informações mais relevantes para o recrutador.",
        },
        {
          role: "system",
          content: `Descrição do cargo: ${jobInfo?.description}`,
        },
        {
          role: "user",
          content: `Curriculo do candidato: ${textFromPDF.text}`,
        },
      ],
      text: {
        format: zodTextFormat(AgentResponseSchema, "resume_info"),
      },
    });

    if (!resumeProcessed.output_parsed) {
      throw new Error("Resposta da API sem dados estruturados (resume_info)");
    }

    await db
      .update(resumes)
      .set({
        status: "processed",
        metadata: resumeProcessed.output_parsed,
      })
      .where(eq(resumes.id, resumeId));
  },
  {
    connection: queueConnection,
    concurrency: 1,
  },
);
