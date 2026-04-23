import { eq } from "drizzle-orm";
import { db } from "../../../infra/db/client.js";
import { resumes } from "../../../infra/db/schema.js";

export type createResumeDTO = {
  email: string;
  filePath: string;
};

type Resume = typeof resumes.$inferSelect;

export interface IResumeRepository {
  create(item: createResumeDTO): Promise<Resume>;
  findUserByEmail(email: string): Promise<Resume | null>;
}

export class resumeRepository implements IResumeRepository {
  constructor(private readonly database = db) {}

  async findUserByEmail(email: string): Promise<Resume | null> {
    const [resume] = await this.database
      .select()
      .from(resumes)
      .where(eq(resumes.email, email));

    return resume ?? null;
  }

  async create(item: createResumeDTO): Promise<Resume> {
    const [resume] = await this.database
      .insert(resumes)
      .values({
        email: item.email,
        filePath: item.filePath,
      })
      .returning();

    if (!resume) {
      throw new Error("Erro ao inserir resume");
    }

    return resume;
  }
}
