import { db } from "../../../infra/db/client.js";
import { resumes } from "../../../infra/db/schema.js";

export type createResumeDTO = {
  email: string;
  fileUrl: string;
};

type Resume = typeof resumes.$inferSelect;

export interface IResumeRepository {
  create(item: createResumeDTO): Promise<Resume>;
}

export class resumeRepository implements IResumeRepository {
  constructor(private readonly database = db) {}

  async create(item: createResumeDTO): Promise<Resume> {
    const [resume] = await this.database
      .insert(resumes)
      .values({
        email: item.email,
        fileUrl: item.fileUrl,
      })
      .returning();

    if (!resume) {
      throw new Error("Erro ao inserir resume");
    }

    return resume;
  }
}
