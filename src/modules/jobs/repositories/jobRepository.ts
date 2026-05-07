import { desc, eq } from "drizzle-orm";
import { db } from "../../../infra/db/client.js";
import {
  type JobStatus,
  jobs,
} from "../../../infra/db/schema.js";

export type CreateJobDTO = {
  title: string;
  description: string;
};

export type UpdateJobDTO = Partial<{
  title: string;
  description: string;
  status: JobStatus;
}>;

type Job = typeof jobs.$inferSelect;

export interface IJobRepository {
  create(item: CreateJobDTO): Promise<Job>;
  findById(id: string): Promise<Job | null>;
  findAll(): Promise<Job[]>;
  update(id: string, item: UpdateJobDTO): Promise<Job | null>;
  delete(id: string): Promise<boolean>;
}

export class jobRepository implements IJobRepository {
  constructor(private readonly database = db) {}

  async create(item: CreateJobDTO): Promise<Job> {
    const [row] = await this.database
      .insert(jobs)
      .values({
        title: item.title,
        description: item.description,
      })
      .returning();

    if (!row) {
      throw new Error("Erro ao criar vaga");
    }

    return row;
  }

  async findById(id: string): Promise<Job | null> {
    const [row] = await this.database
      .select()
      .from(jobs)
      .where(eq(jobs.id, id));

    return row ?? null;
  }

  async findAll(): Promise<Job[]> {
    return this.database.select().from(jobs).orderBy(desc(jobs.createdAt));
  }

  async update(id: string, patch: UpdateJobDTO): Promise<Job | null> {
    const [row] = await this.database
      .update(jobs)
      .set({
        ...patch,
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, id))
      .returning();

    return row ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const rows = await this.database
      .delete(jobs)
      .where(eq(jobs.id, id))
      .returning({ id: jobs.id });

    return rows.length > 0;
  }
}
