import type { MultipartFile } from "@fastify/multipart";
import type { CreateResumeInput } from "../schema.js";
import type { IResumeRepository } from "../repositories/resumeRepository.js";
import { resumeQueue } from "../../../infra/queue/queues.js";
import { randomUUID } from "crypto";
import type { IStorageRepository } from "../repositories/storageRepository.js";
import { EmailAlreadyExists } from "../errors/EmailAlreadyExists.js";

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
      const hasAlreadyUserWithEmail =
        await this.repository.findUserByEmail(email);

      if (hasAlreadyUserWithEmail) {
        throw new EmailAlreadyExists();
      }

      const filePath = `${email}.pdf`;

      const timeToUrlExpires = 60 * 60 * 24;

      const publicUrl = await this.storage.saveFile(
        file,
        filePath,
        timeToUrlExpires,
      );

      const metadata = {
        email,
        filePath: filePath,
      };

      const resume = await this.repository.create(metadata);

      await resumeQueue.add(
        "process-resume",
        {
          resumeId: resume.id,
          fileUrl: publicUrl,
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
