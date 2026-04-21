import type { MultipartFile } from "@fastify/multipart";
import type { CreateResumeInput } from "../schema.js";
import type { IResumeRepository } from "../repositories/resumeRepository.js";
import { resumeQueue } from "../../../infra/queue/queues.js";
import { randomUUID } from "crypto";
import type { IStorageRepository } from "../repositories/storageRepository.js";

type CreateResumeServiceInput = CreateResumeInput & {
  file: MultipartFile;
};

export class CreateResumeService {
  constructor(
    private repository: IResumeRepository,
    private storage: IStorageRepository,
  ) {}
  async execute({ email, file }: CreateResumeServiceInput): Promise<any> {
    if (file.mimetype !== "application/pdf") {
      throw new Error("Apenas arquivos PDF sao aceitos");
    }
    try {
      const randomId = randomUUID();

      const filePath = `${randomId}.pdf`;

      //salva arquivo no storage e obtem publicUrl
      const publicUrl = await this.storage.saveFile(file, filePath);

      //salva metadados no banco
      const metadata = {
        email,
        fileUrl: publicUrl,
      };

      const resume = await this.repository.create(metadata);

      //cria job no worker
      await resumeQueue.add(
        "process-resume",
        {
          resumeId: resume.id,
          fileUrl: metadata.fileUrl,
        },
        {
          attempts: 2,
          removeOnComplete: true,
          removeOnFail: false,
          backoff: {
            type: "exponential",
            delay: 2000,
          },
        },
      );

      return resume;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
