import type { MultipartFile } from "@fastify/multipart";
import type { CreateResumeInput } from "../schema.js";
import { pipeline } from "stream/promises";
import fs from "fs";
import path from "path";
import type { IResumeRepository } from "../repository/resumeRepository.js";
import { resumeQueue } from "../../../infra/queue/queues.js";

type CreateResumeServiceInput = CreateResumeInput & {
  file: MultipartFile;
};

export class CreateResumeService {
  constructor(private repository: IResumeRepository) {}
  async execute({ email, file }: CreateResumeServiceInput): Promise<any> {
    if (file.mimetype !== "application/pdf") {
      throw new Error("Apenas arquivos PDF sao aceitos");
    }
    try {
      const uploadDir = path.resolve("uploads");

      const filePath = path.join(uploadDir, file.filename);

      //salva arquivo no storage(Mudar para s3)
      await pipeline(file.file, fs.createWriteStream(filePath));

      //salva infos e metadados no banco
      const metadata = {
        email: email,
        fileUrl: filePath,
      };
      const resume = await this.repository.create(metadata);

      //cria job no worker
      await resumeQueue.add("process-resume", {
        resumeId: resume.id,
        fileUrl: filePath,
      });

      return resume;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
